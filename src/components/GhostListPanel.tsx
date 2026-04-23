import { Check, Ghost as GhostIcon, Skull, X, Zap } from 'lucide-react';
import { Ghost, GhostManualState } from '../types';
import { getGhostPrimaryHuntThresholdCategory, getGhostPrimarySpeedCategory } from '../utils/journalFilters';
import { splitGhostName } from '../utils/ghostNames';
import { EvidenceIcon } from './EvidenceIcon';

interface GhostListPanelProps {
  ghosts: Ghost[];
  matchingGhostIds: Set<string>;
  ghostMarks: Record<string, GhostManualState>;
  selectedGhostId: string | null;
  onSelectGhost: (ghostId: string) => void;
  onSetGhostMark: (ghostId: string, state: GhostManualState) => void;
}

const thresholdMap: Record<string, string> = {
  Late: 'Поздно',
  Normal: '50%',
  Early: 'Рано',
  'Very Early': '80%+',
  Variable: 'Перем.',
};

const speedMap: Record<string, string> = {
  Slow: 'Медл.',
  Normal: 'Норм.',
  Fast: 'Быстр.',
};

export function GhostListPanel({
  ghosts,
  matchingGhostIds,
  ghostMarks,
  selectedGhostId,
  onSelectGhost,
  onSetGhostMark,
}: GhostListPanelProps) {
  const visibleGhostCount = ghosts.filter((ghost) => matchingGhostIds.has(ghost.id)).length;
  const possibleGhostCount = ghosts.filter((ghost) => ghostMarks[ghost.id] === 'possible').length;
  const ruledOutGhostCount = ghosts.filter((ghost) => ghostMarks[ghost.id] === 'ruled_out').length;

  const toggleGhostMark = (ghostId: string, state: GhostManualState) => {
    const currentState = ghostMarks[ghostId] ?? 'neutral';
    onSetGhostMark(ghostId, currentState === state ? 'neutral' : state);
  };

  return (
    <section className="min-w-0 overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(18,18,20,0.9)] shadow-[0_20px_70px_rgba(0,0,0,0.34)]">
      <div className="border-b border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] px-5 py-4 text-left">
        <div className="text-[11px] uppercase tracking-[0.24em] text-white/34">
          Реестр сущностей
        </div>
        <div className="mt-2 text-sm font-semibold text-white/82">
          Список призраков ({visibleGhostCount})
        </div>
        <p className="mt-2 max-w-xl text-xs leading-6 text-white/45">
          Компактная сетка в 5 колонок. Нажми на призрака, чтобы открыть подробности, или отметь
          его как возможного/точно нет прямо в списке.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-white/34">
          <span className="rounded-full border border-emerald-400/18 bg-emerald-400/10 px-2.5 py-1 text-emerald-100/70">
            Видимых {visibleGhostCount}
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">
            Всего {ghosts.length}
          </span>
          <span className="rounded-full border border-emerald-300/18 bg-emerald-300/[0.06] px-2.5 py-1 text-emerald-100/62">
            Возможно {possibleGhostCount}
          </span>
          <span className="rounded-full border border-red-300/18 bg-red-300/[0.06] px-2.5 py-1 text-red-100/62">
            Нет {ruledOutGhostCount}
          </span>
        </div>
      </div>

      <div className="px-5 pb-5 pt-4">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          {ghosts.map((ghost, index) => {
            const isVisible = matchingGhostIds.has(ghost.id);
            const isSelected = ghost.id === selectedGhostId;
            const manualState = ghostMarks[ghost.id] ?? 'neutral';
            const isMarkedPossible = manualState === 'possible';
            const isMarkedRuledOut = manualState === 'ruled_out';
            const { primaryName, secondaryName } = splitGhostName(ghost.name);
            const thresholdLabel =
              thresholdMap[getGhostPrimaryHuntThresholdCategory(ghost)] ?? '50%';
            const speedCategory = getGhostPrimarySpeedCategory(ghost);
            const speedLabel =
              speedCategory === 'Variable' ? 'Перем.' : speedMap[speedCategory] ?? 'Норм.';

            return (
              <article
                key={ghost.id}
                className={`group relative min-h-[118px] overflow-hidden rounded-[22px] border p-3 transition-all duration-300 ${
                  isMarkedRuledOut
                    ? 'border-red-400/22 bg-red-500/[0.04] opacity-60'
                    : isMarkedPossible
                      ? 'border-emerald-400/28 bg-[linear-gradient(135deg,rgba(52,211,153,0.10),rgba(20,20,24,0.92))] shadow-[0_0_0_1px_rgba(52,211,153,0.08)]'
                      : isSelected
                        ? 'border-[#b9a3ff]/35 bg-[linear-gradient(135deg,rgba(185,163,255,0.16),rgba(20,20,24,0.94))] shadow-[0_0_0_1px_rgba(185,163,255,0.10),0_12px_30px_rgba(0,0,0,0.22)]'
                        : isVisible
                          ? 'border-white/8 bg-white/[0.025] hover:border-white/16 hover:bg-white/[0.05]'
                          : 'border-white/6 bg-white/[0.015] opacity-38'
                }`}
              >
                <button
                  type="button"
                  disabled={!isVisible}
                  onClick={() => onSelectGhost(ghost.id)}
                  className="block w-full text-left disabled:cursor-default"
                >
                  <div
                    className={`absolute bottom-0 left-0 top-0 w-[3px] rounded-full transition-opacity ${
                      isMarkedRuledOut
                        ? 'bg-red-300/75 opacity-100'
                        : isMarkedPossible
                          ? 'bg-emerald-300/80 opacity-100'
                          : isSelected
                            ? 'bg-[#b9a3ff] opacity-100'
                            : 'bg-white/10 opacity-0 group-hover:opacity-100'
                    }`}
                  />

                  <div className="grid grid-cols-[34px_minmax(0,1fr)] items-start gap-2.5">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl border transition-colors ${
                        isMarkedRuledOut
                          ? 'border-red-300/25 bg-red-300/[0.08] text-red-100/70'
                          : isMarkedPossible
                            ? 'border-emerald-300/25 bg-emerald-300/[0.10] text-emerald-100/80'
                            : isSelected
                              ? 'border-[#b9a3ff]/30 bg-[#b9a3ff]/12 text-[#d6c6ff]'
                              : 'border-white/10 bg-white/[0.05] text-white/48'
                      }`}
                    >
                      <GhostIcon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 pr-12">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <div
                          className={`truncate text-[14px] font-semibold leading-5 transition-colors ${
                            isMarkedRuledOut
                              ? 'text-white/48 line-through decoration-red-300/75'
                              : isSelected || isMarkedPossible
                                ? 'text-white'
                                : isVisible
                                  ? 'text-white/88 group-hover:text-white'
                                  : 'text-white/32'
                          }`}
                        >
                          {primaryName}
                        </div>
                        {secondaryName ? (
                          <div className="max-w-[78px] truncate text-[9px] uppercase tracking-[0.2em] text-white/30">
                            {secondaryName}
                          </div>
                        ) : null}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        {ghost.evidence.map((evidence) => (
                          <span
                            key={evidence}
                            className={`inline-flex h-6 w-6 items-center justify-center rounded-xl border ${
                              isMarkedRuledOut
                                ? 'border-red-300/12 bg-red-300/[0.04] text-white/38'
                                : isSelected || isMarkedPossible
                                  ? 'border-white/16 bg-white/[0.08] text-white/90'
                                  : 'border-white/10 bg-white/[0.04] text-white/62'
                            }`}
                          >
                            <EvidenceIcon evidence={evidence} className="h-3.5 w-3.5" />
                          </span>
                        ))}

                        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[9px] uppercase tracking-[0.16em] text-white/48">
                          <Zap className="h-3 w-3 text-amber-300/85" />
                          {speedLabel}
                        </span>

                        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[9px] uppercase tracking-[0.16em] text-white/48">
                          <Skull className="h-3 w-3 text-rose-300/80" />
                          {thresholdLabel}
                        </span>
                      </div>
                    </div>

                    <div className="absolute right-3 top-3 flex flex-col items-end gap-2">
                      <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/22">
                        {String(index + 1).padStart(2, '0')}
                      </div>

                      <div
                        className={`h-2 w-2 rounded-full border ${
                          isMarkedRuledOut
                            ? 'border-red-200/30 bg-red-300/60'
                            : isMarkedPossible
                              ? 'border-emerald-200/30 bg-emerald-300/70'
                              : isSelected
                                ? 'border-[#b9a3ff]/40 bg-[#b9a3ff]'
                                : isVisible
                                  ? 'border-white/18 bg-white/10 group-hover:bg-white/20'
                                  : 'border-white/10 bg-transparent'
                        }`}
                      />
                    </div>
                  </div>
                </button>

                <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleGhostMark(ghost.id, 'possible');
                    }}
                    className={`flex h-7 w-7 items-center justify-center rounded-xl border transition-all ${
                      isMarkedPossible
                        ? 'border-emerald-300/35 bg-emerald-300/18 text-emerald-50'
                        : 'border-white/10 bg-black/30 text-white/32 hover:border-emerald-300/30 hover:text-emerald-100'
                    }`}
                    title="Возможно"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleGhostMark(ghost.id, 'ruled_out');
                    }}
                    className={`flex h-7 w-7 items-center justify-center rounded-xl border transition-all ${
                      isMarkedRuledOut
                        ? 'border-red-300/35 bg-red-300/18 text-red-50'
                        : 'border-white/10 bg-black/30 text-white/32 hover:border-red-300/30 hover:text-red-100'
                    }`}
                    title="Точно нет"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        <div className="mt-5 border-t border-white/10 pt-4 text-sm leading-relaxed text-white/52">
          Сначала сузь список фильтрами слева, затем вручную пометь спорные варианты: зеленая
          галочка оставляет призрака в приоритете, красный крест вычеркивает его как точно неверный.
        </div>
      </div>
    </section>
  );
}
