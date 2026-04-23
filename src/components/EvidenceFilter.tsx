import { useMemo, useState } from 'react';
import {
  ChevronDown,
  Mic,
  MicOff,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Zap,
  Skull,
  Check,
  X,
  BookOpen,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import {
  Evidence,
  EvidenceSelectionState,
  EvidenceStateMap,
  GhostSpeed,
  HuntThreshold,
  InvestigationDifficulty,
} from '../types';
import { evidenceTranslations } from '../utils/translations';
import {
  ALL_EVIDENCE,
  getConfirmedEvidence,
  getDifficultyMeta,
  getRuledOutEvidence,
  JOURNAL_DIFFICULTIES,
} from '../utils/journalFilters';
import { EvidenceIcon } from './EvidenceIcon';

interface EvidenceFilterProps {
  difficulty: InvestigationDifficulty;
  onDifficultyChange: (difficulty: InvestigationDifficulty) => void;
  evidenceStates: EvidenceStateMap;
  onSetEvidenceState: (evidence: Evidence, state: EvidenceSelectionState) => void;
  selectedSpeeds: GhostSpeed[];
  onToggleSpeed: (speed: GhostSpeed) => void;
  selectedHuntThresholds: HuntThreshold[];
  onToggleHuntThreshold: (threshold: HuntThreshold) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onReset: () => void;
  hasMeasuredSpeedFilter: boolean;
  hasGhostMarkFilters: boolean;
}

const SPEEDS: Array<{ label: string; value: GhostSpeed; note: string }> = [
  { label: 'Медленный', value: 'Slow', note: '< 1.7 м/с' },
  { label: 'Нормальный', value: 'Normal', note: '= 1.7 м/с' },
  { label: 'Быстрый', value: 'Fast', note: '> 1.7 м/с' },
];

const THRESHOLDS: Array<{ label: string; value: HuntThreshold; note: string }> = [
  { label: 'Поздно', value: 'Late', note: '< 50%' },
  { label: 'Нормально', value: 'Normal', note: '= 50%' },
  { label: 'Рано', value: 'Early', note: '> 50%' },
  { label: 'Очень рано', value: 'Very Early', note: '> 80%' },
];

type FilterSectionKey = 'evidence' | 'speed' | 'threshold';

function countActiveFilters(
  difficulty: InvestigationDifficulty,
  evidenceStates: EvidenceStateMap,
  selectedSpeeds: GhostSpeed[],
  selectedHuntThresholds: HuntThreshold[],
  searchQuery: string,
  hasMeasuredSpeedFilter: boolean,
  hasGhostMarkFilters: boolean,
) {
  const evidenceCount =
    getConfirmedEvidence(evidenceStates).length + getRuledOutEvidence(evidenceStates).length;

  return (
    evidenceCount +
    selectedSpeeds.length +
    selectedHuntThresholds.length +
    (hasMeasuredSpeedFilter ? 1 : 0) +
    (hasGhostMarkFilters ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0) +
    (difficulty === 'Professional' ? 0 : 1)
  );
}

function getNextEvidenceState(state: EvidenceSelectionState): EvidenceSelectionState {
  if (state === 'neutral') {
    return 'confirmed';
  }

  if (state === 'confirmed') {
    return 'ruled_out';
  }

  return 'neutral';
}

function isEvidenceLockedByDifficulty(
  evidence: Evidence,
  state: EvidenceSelectionState,
  confirmedEvidence: Evidence[],
  visibleEvidenceLimit: number,
) {
  if (state !== 'neutral') {
    return false;
  }

  if (visibleEvidenceLimit >= 3) {
    return false;
  }

  if (evidence === 'Ghost Orb') {
    return false;
  }

  const confirmedStandardEvidenceCount = confirmedEvidence.filter(
    (confirmed) => confirmed !== 'Ghost Orb',
  ).length;

  return confirmedStandardEvidenceCount >= visibleEvidenceLimit;
}

export function EvidenceFilter({
  difficulty,
  onDifficultyChange,
  evidenceStates,
  onSetEvidenceState,
  selectedSpeeds,
  onToggleSpeed,
  selectedHuntThresholds,
  onToggleHuntThreshold,
  searchQuery,
  onSearchChange,
  onReset,
  hasMeasuredSpeedFilter,
  hasGhostMarkFilters,
}: EvidenceFilterProps) {
  const [isListening, setIsListening] = useState(false);
  const [openSections, setOpenSections] = useState<Record<FilterSectionKey, boolean>>({
    evidence: true,
    speed: false,
    threshold: false,
  });

  const confirmedEvidence = useMemo(() => getConfirmedEvidence(evidenceStates), [evidenceStates]);
  const ruledOutEvidence = useMemo(() => getRuledOutEvidence(evidenceStates), [evidenceStates]);
  const difficultyMeta = useMemo(() => getDifficultyMeta(difficulty), [difficulty]);

  const activeFilterCount = countActiveFilters(
    difficulty,
    evidenceStates,
    selectedSpeeds,
    selectedHuntThresholds,
    searchQuery,
    hasMeasuredSpeedFilter,
    hasGhostMarkFilters,
  );

  const evidenceHint =
    difficultyMeta.visibleEvidence === 3
      ? 'На Профессионале зачёркнутая улика сразу исключает призрака.'
      : 'На этой сложности часть улик скрыта. Зачёркнутая улика исключает только те варианты, у которых уже не остаётся допустимой видимой комбинации. У Мимика огонёк всё равно возможен.';

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Голосовой ввод не поддерживается в вашем браузере.');
      return;
    }

    const SpeechRecognition =
      (window as Window & { SpeechRecognition?: any; webkitSpeechRecognition?: any })
        .SpeechRecognition ||
      (window as Window & { SpeechRecognition?: any; webkitSpeechRecognition?: any })
        .webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'ru-RU';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      onSearchChange(event.results[0][0].transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const toggleSection = (section: FilterSectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const cycleEvidenceState = (evidence: Evidence) => {
    onSetEvidenceState(evidence, getNextEvidenceState(evidenceStates[evidence]));
  };

  const sectionButtonClass =
    'flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-3 text-left transition-all hover:border-white/18 hover:bg-white/[0.05]';

  return (
    <Card className="overflow-hidden rounded-[28px] border-white/10 bg-[rgba(10,10,12,0.92)] shadow-[0_20px_70px_rgba(0,0,0,0.42)] backdrop-blur-xl">
      <CardHeader className="border-b border-white/8 bg-white/[0.03] pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-white/38">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Журнал исследователя
            </div>
            <CardTitle className="text-left font-journal text-lg uppercase tracking-[0.12em] text-white/92">
              Фильтры расследования
            </CardTitle>
          </div>

          <button
            onClick={onReset}
            disabled={activeFilterCount === 0}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/45 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            title="Сбросить фильтры"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.05] px-3 py-3">
            <div className="text-[9px] uppercase tracking-[0.22em] text-emerald-200/55">Есть</div>
            <div className="mt-1 text-lg font-mono font-semibold text-white/90">
              {confirmedEvidence.length}
            </div>
          </div>
          <div className="rounded-2xl border border-red-500/15 bg-red-500/[0.05] px-3 py-3">
            <div className="text-[9px] uppercase tracking-[0.22em] text-red-200/50">Нет</div>
            <div className="mt-1 text-lg font-mono font-semibold text-white/90">
              {ruledOutEvidence.length}
            </div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-black/30 px-3 py-3">
            <div className="text-[9px] uppercase tracking-[0.22em] text-white/35">Активно</div>
            <div className="mt-1 text-lg font-mono font-semibold text-white/90">
              {activeFilterCount}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-4 pb-4 pt-4">
        <div className="rounded-[20px] border border-white/10 bg-black/30 p-3">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-white/30" />
            <Input
              placeholder="Поиск по призракам и механикам..."
              className="h-11 rounded-2xl border-white/10 bg-white/[0.04] pl-10 pr-11 text-sm text-white placeholder:text-white/22 focus-visible:ring-white/20"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
            />
            <button
              onClick={startListening}
              className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center transition-colors ${
                isListening ? 'text-red-500 animate-pulse' : 'text-white/35 hover:text-white/80'
              }`}
              title="Голосовой поиск"
            >
              {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-black/35 p-3.5">
          <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/42">
            <BookOpen className="h-3.5 w-3.5" />
            Сложность
          </div>

          <Select
            value={difficulty}
            onValueChange={(value) => onDifficultyChange(value as InvestigationDifficulty)}
          >
            <SelectTrigger className="h-11 w-full rounded-2xl border-white/10 bg-white/[0.04] px-3 text-sm text-white">
              <span className="line-clamp-1">{difficultyMeta.label}</span>
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#111114] text-white">
              {JOURNAL_DIFFICULTIES.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="focus:bg-white/10 focus:text-white"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <p className="mt-2 text-[11px] leading-relaxed text-white/48">
            {difficultyMeta.note}
          </p>
        </div>

        <div className="overflow-hidden rounded-[22px] border border-white/10 bg-black/30">
          <button
            onClick={() => toggleSection('evidence')}
            className={sectionButtonClass}
          >
            <div>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/42">
                <BookOpen className="h-3.5 w-3.5" />
                Улики
              </div>
              <div className="mt-1 text-[11px] text-white/35">
                {confirmedEvidence.length + ruledOutEvidence.length} отмечено
              </div>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-white/40 transition-transform ${
                openSections.evidence ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSections.evidence && (
            <div className="space-y-2 px-3.5 pb-3.5">
              {ALL_EVIDENCE.map((evidence) => {
                const state = evidenceStates[evidence];
                const isConfirmed = state === 'confirmed';
                const isRuledOut = state === 'ruled_out';
                const isLocked = isEvidenceLockedByDifficulty(
                  evidence,
                  state,
                  confirmedEvidence,
                  difficultyMeta.visibleEvidence,
                );

                return (
                  <button
                    key={evidence}
                    disabled={isLocked}
                    onClick={() => cycleEvidenceState(evidence)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2.5 text-left transition-all ${
                      isLocked
                        ? 'cursor-not-allowed border-white/6 bg-white/[0.015] opacity-35 grayscale'
                        : isConfirmed
                        ? 'border-emerald-400/20 bg-emerald-400/[0.08]'
                        : isRuledOut
                          ? 'border-red-400/20 bg-red-400/[0.07]'
                          : 'border-white/8 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border ${
                          isConfirmed
                            ? 'border-emerald-300/30 bg-emerald-300/[0.12]'
                            : isRuledOut
                              ? 'border-red-300/30 bg-red-300/[0.10]'
                              : 'border-white/10 bg-white/[0.04]'
                        }`}
                      >
                        <EvidenceIcon evidence={evidence} className="h-4 w-4" />
                      </span>
                      <span
                        className={`text-[13px] leading-snug ${
                          isRuledOut
                            ? 'text-white/34 line-through decoration-red-300/70'
                            : isConfirmed
                              ? 'text-white'
                              : 'text-white/72'
                        }`}
                      >
                        {evidenceTranslations[evidence]}
                      </span>
                    </div>

                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-xl border ${
                        isConfirmed
                          ? 'border-emerald-300/30 bg-emerald-300/12 text-emerald-100'
                          : isRuledOut
                            ? 'border-red-300/30 bg-red-300/12 text-red-100'
                            : 'border-white/10 bg-white/[0.04] text-white/30'
                      }`}
                    >
                      {isConfirmed ? <Check className="h-4 w-4" /> : isRuledOut ? <X className="h-4 w-4" /> : null}
                    </span>
                  </button>
                );
              })}

              <p className="pt-1 text-[11px] leading-relaxed text-white/48">
                {evidenceHint}
              </p>
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-[22px] border border-white/10 bg-black/30">
          <button
            onClick={() => toggleSection('speed')}
            className={sectionButtonClass}
          >
            <div>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/42">
                <Zap className="h-3.5 w-3.5 text-amber-300/80" />
                Скорость призрака
              </div>
              <div className="mt-1 text-[11px] text-white/35">
                {selectedSpeeds.length ? `${selectedSpeeds.length} выбрано` : 'Фильтр отключён'}
              </div>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-white/40 transition-transform ${
                openSections.speed ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSections.speed && (
            <div className="space-y-2 px-3.5 pb-3.5">
              {SPEEDS.map((speed) => {
                const active = selectedSpeeds.includes(speed.value);

                return (
                  <button
                    key={speed.value}
                    onClick={() => onToggleSpeed(speed.value)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2.5 text-left transition-all ${
                      active
                        ? 'border-amber-300/20 bg-amber-300/[0.08] text-white'
                        : 'border-white/8 bg-white/[0.03] text-white/62 hover:border-white/15 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div>
                      <div className="text-[13px] font-medium">{speed.label}</div>
                      <div className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                        {speed.note}
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.16em] ${
                        active ? 'bg-amber-300/15 text-amber-100' : 'bg-white/[0.04] text-white/35'
                      }`}
                    >
                      {speed.value}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-[22px] border border-white/10 bg-black/30">
          <button
            onClick={() => toggleSection('threshold')}
            className={sectionButtonClass}
          >
            <div>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/42">
                <Skull className="h-3.5 w-3.5 text-red-300/80" />
                Рассудок охоты
              </div>
              <div className="mt-1 text-[11px] text-white/35">
                {selectedHuntThresholds.length ? `${selectedHuntThresholds.length} выбрано` : 'Фильтр отключён'}
              </div>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-white/40 transition-transform ${
                openSections.threshold ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSections.threshold && (
            <div className="space-y-2 px-3.5 pb-3.5">
              {THRESHOLDS.map((threshold) => {
                const active = selectedHuntThresholds.includes(threshold.value);

                return (
                  <button
                    key={threshold.value}
                    onClick={() => onToggleHuntThreshold(threshold.value)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2.5 text-left transition-all ${
                      active
                        ? 'border-red-300/20 bg-red-300/[0.08] text-white'
                        : 'border-white/8 bg-white/[0.03] text-white/62 hover:border-white/15 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div>
                      <div className="text-[13px] font-medium">{threshold.label}</div>
                      <div className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                        Порог начала охоты
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.16em] ${
                        active ? 'bg-red-300/15 text-red-100' : 'bg-white/[0.04] text-white/35'
                      }`}
                    >
                      {threshold.note}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
