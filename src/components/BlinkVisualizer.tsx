import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type GhostType = 'normal' | 'phantom' | 'oni';

export function BlinkVisualizer() {
  const [activeGhost, setActiveGhost] = useState<GhostType>('normal');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let isCurrentlyVisible = true;

    const runLoop = () => {
      setIsVisible(isCurrentlyVisible);
      
      let duration = 300;
      if (activeGhost === 'normal') {
        duration = 300;
      } else if (activeGhost === 'phantom') {
        duration = isCurrentlyVisible ? 150 : 850;
      } else if (activeGhost === 'oni') {
        duration = isCurrentlyVisible ? 800 : 200;
      }

      timeout = setTimeout(() => {
        isCurrentlyVisible = !isCurrentlyVisible;
        runLoop();
      }, duration);
    };

    runLoop();

    return () => clearTimeout(timeout);
  }, [activeGhost]);

  return (
    <Card className="overflow-hidden rounded-[22px] border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.065),rgba(255,255,255,0.025)_45%,rgba(4,4,6,0.86))] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_34px_rgba(0,0,0,0.26)] backdrop-blur-xl transition-colors hover:border-white/16">
      <CardHeader className="border-b border-white/8 bg-white/[0.025] px-4 py-3">
        <CardTitle className="text-xs font-journal uppercase tracking-widest text-white/80 flex items-center gap-2">
          <Eye className="h-4 w-4" /> Мерцание при охоте
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-4 pt-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveGhost('normal')}
            className={`flex-1 py-1.5 text-[10px] uppercase tracking-wider rounded transition-colors border ${
              activeGhost === 'normal' 
                ? 'bg-white/20 text-white border-white/30' 
                : 'bg-white/5 text-white/50 border-transparent hover:bg-white/10'
            }`}
          >
            Обычный
          </button>
          <button
            onClick={() => setActiveGhost('phantom')}
            className={`flex-1 py-1.5 text-[10px] uppercase tracking-wider rounded transition-colors border ${
              activeGhost === 'phantom' 
                ? 'bg-white/20 text-white border-white/30' 
                : 'bg-white/5 text-white/50 border-transparent hover:bg-white/10'
            }`}
          >
            Фантом
          </button>
          <button
            onClick={() => setActiveGhost('oni')}
            className={`flex-1 py-1.5 text-[10px] uppercase tracking-wider rounded transition-colors border ${
              activeGhost === 'oni' 
                ? 'bg-white/20 text-white border-white/30' 
                : 'bg-white/5 text-white/50 border-transparent hover:bg-white/10'
            }`}
          >
            Они
          </button>
        </div>

        <div className="relative flex h-24 w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/45">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
          
          <div 
            className={`flex flex-col items-center justify-center ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="h-16 w-12 bg-white/80 rounded-t-full blur-[2px] shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
          </div>

          <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[9px] text-white/30 font-mono">
            {isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            {isVisible ? 'ВИДИМ' : 'НЕВИДИМ'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
