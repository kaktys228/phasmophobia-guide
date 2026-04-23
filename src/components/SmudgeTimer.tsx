import { useState, useEffect } from 'react';
import { Play, Square, Timer, AlertTriangle, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SmudgeTimer() {
  const [isActive, setIsActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const toggleTimer = () => {
    if (isActive) {
      setIsActive(false);
      setTimeElapsed(0);
    } else {
      setIsActive(true);
      setTimeElapsed(0);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Thresholds
  const demonTime = 60;
  const normalTime = 90;
  const spiritTime = 180;

  const getStatus = () => {
    if (!isActive && timeElapsed === 0) return "Таймер благовоний";
    if (timeElapsed < demonTime) return "Безопасно (пока что)";
    if (timeElapsed < normalTime) return "Демон может начать охоту!";
    if (timeElapsed < spiritTime) return "Обычные призраки могут начать охоту!";
    return "Дух может начать охоту! (Все могут)";
  };

  const getProgress = () => {
    return Math.min((timeElapsed / spiritTime) * 100, 100);
  };

  const getStatusColor = () => {
    if (!isActive && timeElapsed === 0) return "text-white/50";
    if (timeElapsed < demonTime) return "text-green-400";
    if (timeElapsed < normalTime) return "text-yellow-400";
    if (timeElapsed < spiritTime) return "text-orange-400";
    return "text-red-500";
  };

  return (
    <Card className="overflow-hidden rounded-[22px] border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.065),rgba(255,255,255,0.025)_45%,rgba(4,4,6,0.86))] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_34px_rgba(0,0,0,0.26)] backdrop-blur-xl transition-colors hover:border-white/16">
      <CardHeader className="border-b border-white/8 bg-white/[0.025] px-4 py-3">
        <CardTitle className="text-xs font-journal uppercase tracking-widest text-white/80 flex items-center gap-2">
          <Timer className="h-4 w-4" /> Таймер благовоний
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className={`text-[10px] font-medium uppercase tracking-widest ${getStatusColor()} flex items-center gap-1.5 mb-1`}>
              {timeElapsed >= demonTime && <AlertTriangle className="h-3 w-3" />}
              {getStatus()}
            </span>
            <span className="text-3xl font-mono text-white tracking-wider font-bold drop-shadow-md">
              {formatTime(timeElapsed)}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsActive(false);
                setTimeElapsed(0);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-all hover:bg-white/10 hover:text-white"
              title="Сбросить таймер"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={toggleTimer}
              className={`flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all ${
                isActive 
                  ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/50' 
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              }`}
            >
              {isActive ? <Square className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
            </button>
          </div>
        </div>
        
        <div className="space-y-1.5">
          <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-linear ${
                timeElapsed >= spiritTime ? 'bg-red-500' : 
                timeElapsed >= normalTime ? 'bg-orange-400' : 
                timeElapsed >= demonTime ? 'bg-yellow-400' : 'bg-white/40'
              }`}
              style={{ width: `${getProgress()}%` }}
            />
            {/* Markers */}
            <div className="absolute top-0 left-[33.33%] w-px h-full bg-black/50 z-10" />
            <div className="absolute top-0 left-[50%] w-px h-full bg-black/50 z-10" />
          </div>
          <div className="flex justify-between text-[9px] text-white/40 font-mono px-1 uppercase tracking-wider text-center">
            <div className="flex flex-col"><span className="mb-0.5">0S</span></div>
            <div className="flex flex-col items-center"><span className="mb-0.5">60S</span><span className={timeElapsed >= demonTime ? 'text-yellow-400 font-bold' : ''}>(ДЕМОН)</span></div>
            <div className="flex flex-col items-center"><span className="mb-0.5">90S</span><span className={timeElapsed >= normalTime ? 'text-orange-400 font-bold' : ''}>(ОБЫЧНЫЕ)</span></div>
            <div className="flex flex-col items-end"><span className="mb-0.5">180S</span><span className={timeElapsed >= spiritTime ? 'text-red-500 font-bold' : ''}>(ДУХ)</span></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
