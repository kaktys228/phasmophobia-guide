export type Evidence = 
  | 'EMF Level 5'
  | 'Fingerprints'
  | 'Ghost Writing'
  | 'Freezing Temperatures'
  | 'Ghost Orb'
  | 'Spirit Box'
  | 'D.O.T.S. Projector';

export type InvestigationDifficulty = 'Professional' | 'Nightmare' | 'Insanity' | 'Apocalypse';
export type EvidenceSelectionState = 'neutral' | 'confirmed' | 'ruled_out';
export type EvidenceStateMap = Record<Evidence, EvidenceSelectionState>;
export type GhostManualState = 'neutral' | 'possible' | 'ruled_out';

export type GhostSpeed = 'Slow' | 'Normal' | 'Fast';
export type HuntThreshold = 'Late' | 'Normal' | 'Early' | 'Very Early' | 'Variable';

export interface Ghost {
  id: string;
  name: string;
  description: string;
  strength: string;
  weakness: string;
  evidence: Evidence[];
  abilities: string[];
  hiddenFacts?: string[];
  behaviorFacts?: string[];
  strategies?: string[];
  speed: GhostSpeed[];
  speedRange?: string;
  speedStates?: { speed: number; label: string }[];
  huntThreshold: HuntThreshold;
  huntThresholdValue?: string;
  image: string;
}
