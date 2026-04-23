import { useEffect, useMemo, useState } from 'react';
import { Calculator, GraduationCap, Info, Target } from 'lucide-react';

const XP_FORMATTER = new Intl.NumberFormat('ru-RU');

function getXpForLevel(level: number) {
  if (level <= 1) {
    return 0;
  }

  if (level <= 100) {
    return Math.floor(100 * Math.pow(level - 1, 1.73));
  }

  if (level <= 999) {
    return 283432 + 4971 * (level - 100);
  }

  return Math.floor(4468929 + 100 * Math.pow(level - 900, 1.73));
}

function normalizeTarget(
  currentPrestige: number,
  currentLevel: number,
  targetPrestige: number,
  targetLevel: number
) {
  let prestige = targetPrestige;
  let level = targetLevel;

  if (targetPrestige < currentPrestige) {
    prestige = currentPrestige;
    level = currentLevel + 1;
  } else if (targetPrestige === currentPrestige && targetLevel <= currentLevel) {
    level = Math.min(currentLevel + 1, 9999);
  }

  return {
    prestige: Math.max(0, Math.min(20, prestige)),
    level: Math.max(1, Math.min(9999, level)),
  };
}

function calculateRequiredXp(
  currentPrestige: number,
  currentLevel: number,
  targetPrestige: number,
  targetLevel: number
) {
  if (targetPrestige < currentPrestige || (targetPrestige === currentPrestige && targetLevel <= currentLevel)) {
    return 0;
  }

  if (currentPrestige === targetPrestige) {
    return getXpForLevel(targetLevel) - getXpForLevel(currentLevel);
  }

  let totalXp = 0;

  if (currentLevel < 100) {
    totalXp += getXpForLevel(100) - getXpForLevel(currentLevel);
  }

  const intermediatePrestiges = targetPrestige - currentPrestige - 1;
  if (intermediatePrestiges > 0) {
    totalXp += intermediatePrestiges * getXpForLevel(100);
  }

  totalXp += getXpForLevel(targetLevel);
  return totalXp;
}

function NumericField({
  label,
  value,
  onChange,
  min,
  max,
  error = false,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  error?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wide text-white/55">{label}</label>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => {
          const nextValue = Number.parseInt(event.target.value, 10);
          if (Number.isNaN(nextValue)) {
            onChange(min);
            return;
          }

          onChange(Math.max(min, Math.min(max, nextValue)));
        }}
        className={`h-14 w-full rounded-xl border bg-black/60 px-4 font-mono text-lg font-bold text-white outline-none transition-colors ${
          error
            ? 'border-red-500/50 focus:border-red-400'
            : 'border-white/10 focus:border-[#b9a3ff]/60'
        }`}
      />
    </div>
  );
}

function ContractCard({ label, value, xpPerContract }: { label: string; value: number; xpPerContract: number }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/25 p-4 text-center">
      <div className="text-xs font-bold text-white/55">{label}</div>
      <div className="mt-2 text-3xl font-journal text-white">{value}</div>
      <div className="mt-1 text-xs text-white/40">~{XP_FORMATTER.format(xpPerContract)} XP</div>
    </div>
  );
}

export function ExperienceCalculatorTab() {
  const [currentPrestige, setCurrentPrestige] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [targetPrestige, setTargetPrestige] = useState(1);
  const [targetLevel, setTargetLevel] = useState(1);
  const [customXpInput, setCustomXpInput] = useState('');

  useEffect(() => {
    const normalizedTarget = normalizeTarget(currentPrestige, currentLevel, targetPrestige, targetLevel);

    if (normalizedTarget.prestige !== targetPrestige) {
      setTargetPrestige(normalizedTarget.prestige);
    }

    if (normalizedTarget.level !== targetLevel) {
      setTargetLevel(normalizedTarget.level);
    }
  }, [currentPrestige, currentLevel, targetPrestige, targetLevel]);

  const customXpPerContract = useMemo(() => {
    const parsed = Number.parseInt(customXpInput, 10);
    if (Number.isNaN(parsed) || parsed <= 0) {
      return null;
    }

    return Math.min(100000, parsed);
  }, [customXpInput]);

  const targetError = targetPrestige < currentPrestige || (targetPrestige === currentPrestige && targetLevel <= currentLevel);
  const normalizedTarget = normalizeTarget(currentPrestige, currentLevel, targetPrestige, targetLevel);

  const requiredXp = useMemo(
    () => calculateRequiredXp(currentPrestige, currentLevel, normalizedTarget.prestige, normalizedTarget.level),
    [currentPrestige, currentLevel, normalizedTarget.level, normalizedTarget.prestige]
  );

  const levelDelta = useMemo(() => {
    if (normalizedTarget.prestige === currentPrestige) {
      return Math.max(0, normalizedTarget.level - currentLevel);
    }

    return 100 - currentLevel + (normalizedTarget.prestige - currentPrestige - 1) * 100 + normalizedTarget.level;
  }, [currentLevel, currentPrestige, normalizedTarget.level, normalizedTarget.prestige]);

  const contracts = useMemo(() => {
    const x4 = Math.ceil(requiredXp / 1500);
    const x6 = Math.ceil(requiredXp / 2000);
    const x10 = Math.ceil(requiredXp / 4000);
    const custom = customXpPerContract ? Math.ceil(requiredXp / customXpPerContract) : null;

    return { x4, x6, x10, custom };
  }, [customXpPerContract, requiredXp]);

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10 max-w-3xl">
        <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
          <Calculator className="h-7 w-7 text-[#b9a3ff]" />
        </div>
        <h2 className="text-5xl font-journal text-white">Калькулятор опыта</h2>
        <p className="mt-4 text-base text-white/55">
          Планируйте путь к следующему престижу и сразу смотрите, сколько опыта и контрактов потребуется до нужной цели.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          <div className="rounded-[24px] border border-white/10 bg-[rgba(20,20,20,0.68)] p-5 shadow-2xl">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white">
                  <GraduationCap className="h-5 w-5 text-[#b9a3ff]" />
                  <h3 className="text-sm font-bold uppercase tracking-wide">Текущий уровень</h3>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <NumericField label="Престиж" value={currentPrestige} onChange={setCurrentPrestige} min={0} max={20} />
                  <NumericField label="Уровень" value={currentLevel} onChange={setCurrentLevel} min={1} max={9999} />
                </div>
              </div>

              <div className="h-px bg-white/10" />

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white">
                  <Target className="h-5 w-5 text-[#b9a3ff]" />
                  <h3 className="text-sm font-bold uppercase tracking-wide">Цель</h3>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <NumericField
                    label="Престиж"
                    value={targetPrestige}
                    onChange={setTargetPrestige}
                    min={0}
                    max={20}
                    error={targetError}
                  />
                  <NumericField
                    label="Уровень"
                    value={targetLevel}
                    onChange={setTargetLevel}
                    min={1}
                    max={9999}
                    error={targetError}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-[rgba(20,20,20,0.68)] p-5 shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white">
                <Info className="h-5 w-5 text-[#b9a3ff]" />
                <h3 className="text-sm font-bold uppercase tracking-wide">Кастомный опыт за игру</h3>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wide text-white/55">XP за контракт</label>
                <input
                  type="number"
                  min={0}
                  max={100000}
                  value={customXpInput}
                  onChange={(event) => setCustomXpInput(event.target.value)}
                  placeholder="0"
                  className="h-14 w-full rounded-xl border border-white/10 bg-black/60 px-4 font-mono text-lg font-bold text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#b9a3ff]/60"
                />
              </div>
              <p className="text-sm text-white/45">Оставьте пустым или 0, чтобы не использовать кастомное значение.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-6 rounded-[28px] border border-[#b9a3ff]/55 bg-[#151218] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <div className="mb-6 text-center">
              <div className="text-sm font-bold text-white/60">Необходимо набрать</div>
              <div className="mt-3 font-mono text-5xl font-black tracking-tighter text-[#c8b5ff]">
                {XP_FORMATTER.format(requiredXp)}
              </div>
              <div className="mt-2 text-sm font-bold uppercase tracking-wide text-white/45">опыта</div>
            </div>

            <div className="space-y-6 border-t border-white/10 pt-6">
              <div className="text-center">
                <div className="text-sm font-bold text-white/55">Уровней</div>
                <div className="mt-2 text-4xl font-journal text-white">{levelDelta}</div>
              </div>

              <div className="space-y-4">
                <div className="text-center text-sm font-bold text-white/55">Приблизительно контрактов</div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <ContractCard label="Сложность (x4)" value={contracts.x4} xpPerContract={1500} />
                  <ContractCard label="Сложность (x6)" value={contracts.x6} xpPerContract={2000} />
                  <ContractCard label="Сложность (x10)" value={contracts.x10} xpPerContract={4000} />
                  {contracts.custom !== null && (
                    <div className="sm:col-span-2 xl:col-span-3">
                      <ContractCard label="Кастомный опыт" value={contracts.custom} xpPerContract={customXpPerContract ?? 0} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-12">
          <div className="flex gap-3 rounded-[24px] bg-white/[0.04] border border-white/10 p-5 text-sm text-white/60">
            <Info className="h-4 w-4 shrink-0 mt-0.5 text-white/45" />
            <div className="space-y-3 leading-7">
              <p>Калькулятор использует официальные формулы расчета опыта в Phasmophobia:</p>
              <ul className="ml-4 list-disc space-y-1">
                <li><strong className="text-white/80">Уровни 1-100:</strong> Опыт = 100 × (уровень - 1)^1.73, округлено вниз.</li>
                <li><strong className="text-white/80">Уровни 101-999:</strong> Опыт = 283,432 + 4,971 × (уровень - 100).</li>
                <li><strong className="text-white/80">Уровни 1000+:</strong> Опыт = 4,468,929 + 100 × (уровень - 900)^1.73, округлено вниз.</li>
              </ul>
              <p>
                <strong className="text-white/80">Престиж:</strong> каждый престиж означает прохождение 100 уровней. При
                расчете между разными престижами учитывается путь от текущего уровня до 100, затем все промежуточные
                престижи и уже потом целевой уровень.
              </p>
              <p>
                <strong className="text-white/80">Уровни:</strong> калькулятор поддерживает диапазон от 1 до 9999 и
                автоматически не дает поставить цель ниже текущего состояния.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
