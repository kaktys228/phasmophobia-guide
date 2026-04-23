import { useState, useEffect } from 'react';
import { Activity, Play, Square } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SPEEDS = [
  { label: 'Деоген (рядом)', speed: 0.4, ms: 2500 },
  { label: 'Ревенант (прячется)', speed: 1.0, ms: 1000 },
  { label: 'Ханту (тепло)', speed: 1.4, ms: 714 },
  { label: 'Обычный', speed: 1.7, ms: 588 },
  { label: 'Близнецы (быстр.)', speed: 1.9, ms: 526 },
  { label: 'Джинн (способн.)', speed: 2.5, ms: 400 },
  { label: 'Ревенант (видит)', speed: 3.0, ms: 333 },
  { label: 'Морой (0% расс.)', speed: 3.71, ms: 269 },
];

export function SpeedMetronome() {
  const [activeSpeed, setActiveSpeed] = useState(SPEEDS[3]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTick, setIsTick] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setIsTick(true);
        setTimeout(() => setIsTick(false), 100);
      }, activeSpeed.ms);
    }

    return () => clearInterval(interval);
  }, [isPlaying, activeSpeed]);

  return (
    <Card className="overflow-hidden rounded-[22px] border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.065),rgba(255,255,255,0.025)_45%,rgba(4,4,6,0.86))] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_34px_rgba(0,0,0,0.26)] backdrop-blur-xl transition-colors hover:border-white/16">
      <CardHeader className="border-b border-white/8 bg-white/[0.025] px-4 py-3">
        <CardTitle className="text-xs font-journal uppercase tracking-widest text-white/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" /> Шаги призрака
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-1.5 rounded-full transition-colors ${isPlaying ? 'bg-red-500/20 text-red-500' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            {isPlaying ? <Square className="h-3 w-3" /> : <Play className="h-3 w-3 translate-x-[1px]" />}
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-4 pt-4">
        <select 
          className="w-full rounded-2xl border border-white/10 bg-black/45 p-2.5 text-xs text-white/80 outline-none transition-colors focus:border-white/30"
          value={activeSpeed.speed}
          onChange={(e) => {
            const speed = SPEEDS.find(s => s.speed === parseFloat(e.target.value));
            if (speed) setActiveSpeed(speed);
          }}
        >
          {SPEEDS.map(s => (
            <option key={s.speed} value={s.speed}>{s.speed} м/с - {s.label}</option>
          ))}
        </select>

        <div className="relative flex h-12 w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/45">
          <div 
            className={`absolute inset-0 bg-white/20 transition-opacity duration-75 ${isTick ? 'opacity-100' : 'opacity-0'}`}
          />
          <div className="flex items-center gap-2 z-10">
            <div className={`h-3 w-3 rounded-full transition-colors duration-75 ${isTick ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'bg-white/20'}`} />
            <div className={`h-3 w-3 rounded-full transition-colors duration-75 ${!isTick && isPlaying ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'bg-white/20'}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
