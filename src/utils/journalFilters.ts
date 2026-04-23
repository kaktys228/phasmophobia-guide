import {
  Evidence,
  EvidenceStateMap,
  Ghost,
  GhostSpeed,
  HuntThreshold,
  InvestigationDifficulty,
} from '../types';

export const ALL_EVIDENCE: Evidence[] = [
  'EMF Level 5',
  'Fingerprints',
  'Ghost Writing',
  'Freezing Temperatures',
  'Ghost Orb',
  'Spirit Box',
  'D.O.T.S. Projector',
];

export const JOURNAL_DIFFICULTIES: Array<{
  value: InvestigationDifficulty;
  label: string;
  shortLabel: string;
  visibleEvidence: number;
  note: string;
}> = [
  {
    value: 'Professional',
    label: 'Профессионал (3 улики)',
    shortLabel: 'Профессионал',
    visibleEvidence: 3,
    note: 'Видны все три стандартные улики.',
  },
  {
    value: 'Nightmare',
    label: 'Кошмар (2 улики)',
    shortLabel: 'Кошмар',
    visibleEvidence: 2,
    note: 'Одна улика скрыта.',
  },
  {
    value: 'Insanity',
    label: 'Безумие (1 улика)',
    shortLabel: 'Безумие',
    visibleEvidence: 1,
    note: 'Показывается только одна улика.',
  },
  {
    value: 'Apocalypse',
    label: 'Апокалипсис (0 улик)',
    shortLabel: 'Апокалипсис',
    visibleEvidence: 0,
    note: 'Стандартные улики скрыты. У Мимика огонек все равно возможен.',
  },
];

const ALWAYS_VISIBLE_EXTRA_EVIDENCE: Partial<Record<Ghost['id'], Evidence[]>> = {
  mimic: ['Ghost Orb'],
};

const VARIABLE_HUNT_SPEED_GHOST_IDS = new Set([
  'revenant',
  'hantu',
  'moroi',
  'deogen',
  'thaye',
  'daian',
  'gallu',
  'obambo',
]);

const MIMIC_GHOST_ID = 'mimic';

export function createDefaultEvidenceStateMap(): EvidenceStateMap {
  return ALL_EVIDENCE.reduce((accumulator, evidence) => {
    accumulator[evidence] = 'neutral';
    return accumulator;
  }, {} as EvidenceStateMap);
}

export function getConfirmedEvidence(evidenceStates: EvidenceStateMap): Evidence[] {
  return ALL_EVIDENCE.filter((evidence) => evidenceStates[evidence] === 'confirmed');
}

export function getRuledOutEvidence(evidenceStates: EvidenceStateMap): Evidence[] {
  return ALL_EVIDENCE.filter((evidence) => evidenceStates[evidence] === 'ruled_out');
}

export function getDifficultyMeta(difficulty: InvestigationDifficulty) {
  return JOURNAL_DIFFICULTIES.find((item) => item.value === difficulty) ?? JOURNAL_DIFFICULTIES[0];
}

export function getGhostSearchText(ghost: Ghost) {
  return [
    ghost.name,
    ghost.description,
    ghost.strength,
    ghost.weakness,
    ...ghost.abilities,
    ...(ghost.behaviorFacts ?? []),
    ...(ghost.hiddenFacts ?? []),
    ...(ghost.strategies ?? []),
  ]
    .join(' ')
    .toLowerCase();
}

export function matchesGhostSearch(ghost: Ghost, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return getGhostSearchText(ghost).includes(normalizedQuery);
}

function getEvidenceCombinations(evidences: Evidence[], size: number): Evidence[][] {
  if (size <= 0) {
    return [[]];
  }

  if (size >= evidences.length) {
    return [evidences];
  }

  const combinations: Evidence[][] = [];

  for (let index = 0; index <= evidences.length - size; index += 1) {
    const currentEvidence = evidences[index];
    const remainingCombinations = getEvidenceCombinations(evidences.slice(index + 1), size - 1);

    for (const combination of remainingCombinations) {
      combinations.push([currentEvidence, ...combination]);
    }
  }

  return combinations;
}

function getAlwaysVisibleEvidence(ghost: Ghost): Evidence[] {
  return ALWAYS_VISIBLE_EXTRA_EVIDENCE[ghost.id] ?? [];
}

export function ghostMatchesEvidenceFilters(
  ghost: Ghost,
  evidenceStates: EvidenceStateMap,
  difficulty: InvestigationDifficulty,
) {
  const confirmedEvidence = getConfirmedEvidence(evidenceStates);
  const ruledOutEvidence = getRuledOutEvidence(evidenceStates);
  const alwaysVisibleEvidence = getAlwaysVisibleEvidence(ghost);

  if (
    confirmedEvidence.some(
      (evidence) => !ghost.evidence.includes(evidence) && !alwaysVisibleEvidence.includes(evidence),
    )
  ) {
    return false;
  }

  if (ruledOutEvidence.some((evidence) => alwaysVisibleEvidence.includes(evidence))) {
    return false;
  }

  const visibleEvidenceCount = Math.min(
    getDifficultyMeta(difficulty).visibleEvidence,
    ghost.evidence.length,
  );
  const visibleEvidenceSets = getEvidenceCombinations(ghost.evidence, visibleEvidenceCount);

  return visibleEvidenceSets.some((visibleEvidenceSet) => {
    const visibleEvidence = new Set([...visibleEvidenceSet, ...alwaysVisibleEvidence]);

    return (
      confirmedEvidence.every((evidence) => visibleEvidence.has(evidence)) &&
      ruledOutEvidence.every((evidence) => !visibleEvidence.has(evidence))
    );
  });
}

function extractHuntThresholdNumbers(huntThresholdValue?: string): number[] {
  if (!huntThresholdValue) {
    return [];
  }

  return Array.from(huntThresholdValue.matchAll(/(\d+)\s*%/g), (match) => Number(match[1]));
}

export function getGhostPrimaryHuntThresholdCategory(ghost: Ghost): HuntThreshold {
  const thresholdNumbers = extractHuntThresholdNumbers(ghost.huntThresholdValue);

  if (!thresholdNumbers.length) {
    if (ghost.id === 'mimic') {
      return 'Very Early';
    }

    return ghost.huntThreshold === 'Variable' ? 'Normal' : ghost.huntThreshold;
  }

  const minimumThreshold = Math.min(...thresholdNumbers);
  const maximumThreshold = Math.max(...thresholdNumbers);

  if (maximumThreshold >= 80) {
    return 'Very Early';
  }

  if (maximumThreshold > 50) {
    return 'Early';
  }

  if (minimumThreshold < 50) {
    return 'Late';
  }

  return 'Normal';
}

export function ghostMatchesHuntThresholdFilters(
  ghost: Ghost,
  selectedHuntThresholds: HuntThreshold[],
) {
  if (!selectedHuntThresholds.length) {
    return true;
  }

  const primaryCategory = getGhostPrimaryHuntThresholdCategory(ghost);

  return selectedHuntThresholds.includes(primaryCategory);
}

export function getGhostPrimarySpeedCategory(ghost: Ghost): GhostSpeed | 'Variable' {
  if (VARIABLE_HUNT_SPEED_GHOST_IDS.has(ghost.id)) {
    return 'Variable';
  }

  if (ghost.speed.includes('Normal')) {
    return 'Normal';
  }

  if (ghost.speed.length === 1) {
    return ghost.speed[0];
  }

  return 'Variable';
}

export function ghostMatchesSpeedFilters(ghost: Ghost, selectedSpeeds: GhostSpeed[]) {
  if (!selectedSpeeds.length) {
    return true;
  }

  return selectedSpeeds.some((speed) => {
    if (speed === 'Normal') {
      return getGhostPrimarySpeedCategory(ghost) === 'Normal';
    }

    return ghost.speed.includes(speed);
  });
}

export function ghostMatchesMeasuredSpeed(ghost: Ghost, measuredSpeed: number | null) {
  if (!measuredSpeed) {
    return true;
  }

  if (ghost.id === MIMIC_GHOST_ID) {
    return true;
  }

  const stateSpeeds = ghost.speedStates?.map((state) => state.speed) ?? [];
  const tolerance = 0.07;

  if (stateSpeeds.some((speed) => Math.abs(speed - measuredSpeed) <= tolerance)) {
    return true;
  }

  return false;
}
