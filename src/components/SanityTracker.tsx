import { useState } from 'react';
import { Brain, Minus, Plus, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SanityTracker() {
  const [sanity, setSanity] = useState(100);

  const adjustSanity = (amount: number) => {
    setSanity(prev => Math.min(100, Math.max(0, prev + amount)));
  };

  return (
    <Card className="overflow-hidden rounded-[22px] border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.065),rgba(255,255,255,0.025)_45%,rgba(4,4,6,0.86))] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_34px_rgba(0,0,0,0.26)] backdrop-blur-xl transition-colors hover:border-white/16">
      <CardHeader className="border-b border-white/8 bg-white/[0.025] px-4 py-3">
        <CardTitle className="text-xs font-journal uppercase tracking-widest text-white/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4" /> Рассудок
          </div>
          <button 
            onClick={() => setSanity(100)}
            className="text-[10px] text-white/40 hover:text-white/80 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-4 pt-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => adjustSanity(-5)}
            className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          
          <div className="text-3xl font-mono font-bold text-white tracking-tighter">
            {sanity}%
          </div>

          <button 
            onClick={() => adjustSanity(5)}
            className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => adjustSanity(-10)}
            className="text-[10px] py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-white/60 transition-colors"
            title="Гост ивент"
          >
            Ивент (-10%)
          </button>
          <button 
            onClick={() => adjustSanity(-15)}
            className="text-[10px] py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-white/60 transition-colors"
            title="Способность Юрэй / Ответ доски"
          >
            Юрэй/Доска (-15%)
          </button>
          <button 
            onClick={() => adjustSanity(-25)}
            className="text-[10px] py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-white/60 transition-colors"
            title="Укус Мороя / Карты Таро"
          >
            Крупный (-25%)
          </button>
          <button 
            onClick={() => adjustSanity(25)}
            className="text-[10px] py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-white/60 transition-colors"
            title="Успокоительное (Тир 1/2)"
          >
            Таблетки (+25%)
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
