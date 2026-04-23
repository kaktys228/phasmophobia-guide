import { useEffect, useRef, useState } from 'react';
import { MousePointerClick, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TapSpeedCalculatorProps {
  measuredSpeed?: number | null;
  matchedGhostCount?: number;
  onMeasuredSpeedChange?: (speed: number | null) => void;
}

function getSpeedHint(speed: number | null) {
  if (speed === null) {
    return 'Нажмите минимум два раза, чтобы включить фильтр по скорости.';
  }

  if (speed >= 2.5) {
    return 'Очень быстрый темп: вероятны быстрые режимы Ревенанта, Джинна, Тайэ, Деогена или Мороя.';
  }

  if (speed >= 2.0) {
    return 'Быстрый темп: проверяйте Райдзю, Мороя, Близнецов, Ханту, Тайэ и другие ускоряющиеся типы.';
  }

  if (speed >= 1.55 && speed <= 1.88) {
    return 'Около нормальной скорости: фильтр оставляет призраков с базой примерно 1.7 м/с.';
  }

  if (speed < 1.0) {
    return 'Очень медленно: особенно похоже на Деогена рядом или Ревенанта без видимости.';
  }

  return 'Медленный темп: возможны старый Тайэ, Ханту в тепле, Близнецы или другие медленные режимы.';
}

export function TapSpeedCalculator({
  measuredSpeed = null,
  matchedGhostCount,
  onMeasuredSpeedChange,
}: TapSpeedCalculatorProps) {
  const [taps, setTaps] = useState<number[]>([]);
  const [speed, setSpeed] = useState<number | null>(measuredSpeed);
  const [lastTapAt, setLastTapAt] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (measuredSpeed === null) {
      setSpeed(null);
      setTaps([]);
      setLastTapAt(null);
      return;
    }

    setSpeed(measuredSpeed);
  }, [measuredSpeed]);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  const handleReset = () => {
    setTaps([]);
    setSpeed(null);
    setLastTapAt(null);
    onMeasuredSpeedChange?.(null);
  };

  const handleTap = () => {
    const now = Date.now();
    setLastTapAt(now);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 100);

    setTaps((previousTaps) => {
      const nextTaps = [...previousTaps, now].slice(-5);

      if (nextTaps.length > 1) {
        const totalInterval = nextTaps
          .slice(1)
          .reduce((total, tapTime, index) => total + tapTime - nextTaps[index], 0);
        const averageInterval = totalInterval / (nextTaps.length - 1);
        const calculatedSpeed = Math.min(1000 / averageInterval, 10);
        const roundedSpeed = Number(calculatedSpeed.toFixed(2));

        setSpeed(roundedSpeed);
        onMeasuredSpeedChange?.(roundedSpeed);
      }

      return nextTaps;
    });

    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }

    resetTimeoutRef.current = setTimeout(() => {
      setTaps([]);
    }, 4500);
  };

  return (
    <Card className="overflow-hidden rounded-[22px] border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.065),rgba(255,255,255,0.025)_45%,rgba(4,4,6,0.86))] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_34px_rgba(0,0,0,0.26)] backdrop-blur-xl transition-colors hover:border-white/16">
      <CardHeader className="border-b border-white/8 bg-white/[0.025] px-4 py-3">
        <CardTitle className="flex items-center justify-between text-xs font-journal uppercase tracking-widest text-white/80">
          <div className="flex items-center gap-2">
            <MousePointerClick className="h-4 w-4" /> Тап скорости
          </div>
          <button
            onClick={handleReset}
            className="text-[10px] text-white/40 transition-colors hover:text-white/80"
            title="Сбросить"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-4 pt-4">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="text-center text-[10px] uppercase tracking-tighter text-white/50">
            Нажимайте кнопку в такт шагам
          </div>
          <button
            onMouseDown={handleTap}
            onTouchStart={(event) => {
              event.preventDefault();
              handleTap();
            }}
            className={`flex h-[72px] w-full max-w-[200px] select-none items-center justify-center rounded-2xl border border-white/10 transition-all ${
              isAnimating
                ? 'scale-95 bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                : 'bg-white/5 hover:bg-white/10 active:bg-white/20'
            }`}
          >
            <div className="text-center font-mono">
              {speed ? (
                <>
                  <div className="text-3xl font-bold leading-none text-white">
                    {speed.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-white/60">м/с</div>
                </>
              ) : (
                <div className="text-sm uppercase tracking-widest text-white/40">
                  TAP TAP
                </div>
              )}
            </div>
          </button>
        </div>

        <div className="rounded-2xl border border-white/8 bg-black/25 p-3 text-[11px] leading-5 text-white/58">
          <div className="flex items-center justify-between gap-3">
            <span className="text-white/42">Фильтр по тапу</span>
            <span className="font-mono text-white/78">
              {speed !== null ? `${speed.toFixed(2)} м/с` : 'нет'}
            </span>
          </div>
          <p className="mt-2">{getSpeedHint(speed)}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.16em] text-white/36">
            {typeof matchedGhostCount === 'number' && speed !== null ? (
              <span className="rounded-full border border-amber-300/15 bg-amber-300/[0.06] px-2 py-1 text-amber-100/70">
                Найдено: {matchedGhostCount}
              </span>
            ) : null}
            {lastTapAt ? (
              <span className="rounded-full border border-white/8 bg-white/[0.04] px-2 py-1">
                Последний: {new Date(lastTapAt).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
