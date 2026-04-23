import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Info, Play, Shield, Skull, Sparkles, Square, Volume2, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ghost } from '../types';
import { splitGhostName } from '../utils/ghostNames';
import { evidenceTranslations } from '../utils/translations';
import { getGhostPrimaryHuntThresholdCategory } from '../utils/journalFilters';
import { EvidenceIcon } from './EvidenceIcon';

interface GhostInfoPanelProps {
  ghost: Ghost | null;
}

const speedMap: Record<string, string> = {
  Slow: 'Медленный',
  Normal: 'Нормальный',
  Fast: 'Быстрый',
  Variable: 'Переменный',
};

const thresholdMap: Record<string, string> = {
  Late: 'Поздно',
  Normal: 'Нормально',
  Early: 'Рано',
  'Very Early': 'Очень рано',
  Variable: 'Переменный',
};

const DEFAULT_SPEED_STATES: NonNullable<Ghost['speedStates']> = [
  { speed: 1.7, label: 'Базовая скорость' },
];

function getFootstepInterval(speed: number) {
  return Math.max(170, Math.round(620 / Math.max(speed, 0.35)));
}

function playFootstepPulse(audioContext: AudioContext) {
  const startedAt = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(82, startedAt);
  oscillator.frequency.exponentialRampToValueAtTime(48, startedAt + 0.055);
  gain.gain.setValueAtTime(0.0001, startedAt);
  gain.gain.exponentialRampToValueAtTime(0.17, startedAt + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, startedAt + 0.09);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(startedAt);
  oscillator.stop(startedAt + 0.1);
}

function SpeedAudioPreview({ speedStates }: { speedStates?: Ghost['speedStates'] }) {
  const options = speedStates?.length ? speedStates : DEFAULT_SPEED_STATES;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);
  const selectedSpeed = options[Math.min(selectedIndex, options.length - 1)] ?? options[0];

  useEffect(() => {
    setSelectedIndex(0);
    setIsPlaying(false);
  }, [speedStates]);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }

      void audioContextRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!isPlaying) {
      return;
    }

    const triggerStep = () => {
      const AudioContextConstructor =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

      if (!AudioContextConstructor) {
        return;
      }

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextConstructor();
      }

      if (audioContextRef.current.state === 'suspended') {
        void audioContextRef.current.resume();
      }

      playFootstepPulse(audioContextRef.current);
    };

    triggerStep();
    intervalRef.current = window.setInterval(triggerStep, getFootstepInterval(selectedSpeed.speed));

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, selectedSpeed.speed]);

  return (
    <div className="mt-4 rounded-[18px] border border-white/10 bg-black/25 p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/42">
          <Volume2 className="h-3.5 w-3.5 text-[#b9a3ff]" />
          Прослушать скорость
        </div>
        <span className="font-mono text-sm text-white/78">{selectedSpeed.speed.toFixed(2)} м/с</span>
      </div>

      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        {options.length > 1 ? (
          <Select value={String(selectedIndex)} onValueChange={(value) => setSelectedIndex(Number(value))}>
            <SelectTrigger className="h-11 rounded-2xl border-white/10 bg-white/[0.04] px-3 text-sm text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#111114] text-white">
              {options.map((state, index) => (
                <SelectItem
                  key={`${state.speed}-${state.label}`}
                  value={String(index)}
                  className="focus:bg-white/10 focus:text-white"
                >
                  <span className="font-mono">{state.speed.toFixed(2)} м/с</span>
                  <span className="ml-2 text-white/50">{state.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="flex h-11 items-center rounded-2xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white/72">
            {selectedSpeed.label}
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsPlaying((current) => !current)}
          className={`inline-flex h-11 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-medium transition-all ${
            isPlaying
              ? 'border-red-300/30 bg-red-300/[0.14] text-red-50 shadow-[0_0_18px_rgba(248,113,113,0.12)]'
              : 'border-[#b9a3ff]/24 bg-[#b9a3ff]/10 text-[#e3d8ff] hover:bg-[#b9a3ff]/16'
          }`}
        >
          {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isPlaying ? 'Стоп' : 'Слушать'}
        </button>
      </div>

      <p className="mt-3 text-[11px] leading-5 text-white/42">
        Звук синтезируется локально и ускоряется по выбранному значению, чтобы быстро сравнить
        темп шагов с тем, что слышно на охоте.
      </p>
    </div>
  );
}

export function GhostInfoPanel({ ghost }: GhostInfoPanelProps) {
  if (!ghost) {
    return (
      <section className="flex min-h-[560px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(18,18,20,0.9)] shadow-[0_20px_70px_rgba(0,0,0,0.34)]">
        <div className="border-b border-white/10 px-6 py-5">
          <div className="text-[11px] uppercase tracking-[0.28em] text-white/34">Призраки</div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white">Призраки</h2>
        </div>
        <div className="flex flex-1 items-start justify-start px-6 py-8 text-lg leading-relaxed text-white/72">
          Пожалуйста, выберите призрака из списка для отображения информации о нём.
        </div>
      </section>
    );
  }

  const { primaryName, secondaryName } = splitGhostName(ghost.name);
  const thresholdCategory = getGhostPrimaryHuntThresholdCategory(ghost);

  return (
    <section className="flex min-h-[560px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(18,18,20,0.9)] shadow-[0_20px_70px_rgba(0,0,0,0.34)]">
      <div className="border-b border-white/10 px-6 py-5">
        <div className="text-[11px] uppercase tracking-[0.28em] text-white/34">Призраки</div>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white">{primaryName}</h2>
        {secondaryName ? (
          <div className="mt-2 text-[11px] uppercase tracking-[0.24em] text-white/36">
            {secondaryName}
          </div>
        ) : null}
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-white/66">{ghost.description}</p>
      </div>

      <div className="space-y-6 px-6 py-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-white/40">
              <AlertCircle className="h-4 w-4 text-[#b9a3ff]" />
              Улики
            </div>
            <div className="flex flex-wrap gap-2">
              {ghost.evidence.map((evidence) => (
                <Badge
                  key={evidence}
                  variant="outline"
                  className="inline-flex items-center gap-1.5 border-white/14 bg-white/[0.04] px-3 py-1 text-white/82"
                >
                  <EvidenceIcon evidence={evidence} className="h-3 w-3" />
                  <span>{evidenceTranslations[evidence]}</span>
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-white/38">
                <Skull className="h-4 w-4 text-red-300/80" />
                Рассудок
              </div>
              <div className="mt-3 text-2xl font-semibold text-white">
                {ghost.huntThresholdValue || '50%'}
              </div>
              <div className="mt-2 text-sm text-white/52">
                Категория: {thresholdMap[thresholdCategory] || thresholdCategory}
              </div>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-white/38">
                <Zap className="h-4 w-4 text-amber-300/85" />
                Скорость
              </div>
              <div className="mt-3 text-2xl font-semibold text-white">
                {ghost.speedRange || '1.7 м/с'}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {ghost.speed.map((speed) => (
                  <Badge
                    key={speed}
                    variant="outline"
                    className="border-white/14 bg-white/[0.04] text-white/72"
                  >
                    {speedMap[speed] || speed}
                  </Badge>
                ))}
              </div>
              <SpeedAudioPreview speedStates={ghost.speedStates} />
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-[22px] border border-emerald-400/10 bg-emerald-400/[0.04] p-4">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-emerald-100/55">
                <Sparkles className="h-4 w-4" />
                Сильная сторона
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/82">{ghost.strength}</p>
            </div>

            <div className="rounded-[22px] border border-sky-400/10 bg-sky-400/[0.04] p-4">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-sky-100/50">
                <Shield className="h-4 w-4" />
                Слабая сторона
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/82">{ghost.weakness}</p>
            </div>
          </div>

          {ghost.behaviorFacts?.length ? (
            <div className="space-y-3">
              <div className="text-[11px] uppercase tracking-[0.24em] text-white/40">Поведение</div>
              <ul className="space-y-2 text-sm leading-relaxed text-white/76">
                {ghost.behaviorFacts.map((fact, index) => (
                  <li key={index} className="rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-3">
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="space-y-3">
            <div className="text-[11px] uppercase tracking-[0.24em] text-white/40">Особенности</div>
            <ul className="space-y-2 text-sm leading-relaxed text-white/76">
              {ghost.abilities.map((ability, index) => (
                <li key={index} className="rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-3">
                  {ability}
                </li>
              ))}
            </ul>
          </div>

          {ghost.strategies?.length ? (
            <div className="space-y-3">
              <div className="text-[11px] uppercase tracking-[0.24em] text-white/40">Стратегии</div>
              <ul className="space-y-2 text-sm leading-relaxed text-white/76">
                {ghost.strategies.map((strategy, index) => (
                  <li key={index} className="rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-3">
                    {strategy}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {ghost.hiddenFacts?.length ? (
            <div className="space-y-3 rounded-[24px] border border-dashed border-white/14 bg-white/[0.025] p-4">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-white/42">
                <Info className="h-4 w-4 text-orange-300/80" />
                Скрытые факты
              </div>
              <ul className="space-y-2 text-sm leading-relaxed text-white/68">
                {ghost.hiddenFacts.map((fact, index) => (
                  <li key={index}>{fact}</li>
                ))}
              </ul>
            </div>
          ) : null}
      </div>
    </section>
  );
}
