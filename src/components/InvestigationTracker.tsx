import { useState, useEffect } from 'react';
import { Map, Skull, Flame, PenLine } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function InvestigationTracker() {
  const [room, setRoom] = useState('');
  const [bone, setBone] = useState('');
  const [cursedItem, setCursedItem] = useState('');
  const [notes, setNotes] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('phasmo-tracker');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRoom(parsed.room || '');
        setBone(parsed.bone || '');
        setCursedItem(parsed.cursedItem || '');
        setNotes(parsed.notes || '');
      } catch (e) {}
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('phasmo-tracker', JSON.stringify({ room, bone, cursedItem, notes }));
  }, [room, bone, cursedItem, notes]);

  const clearAll = () => {
    setRoom('');
    setBone('');
    setCursedItem('');
    setNotes('');
  };

  return (
    <Card className="overflow-hidden rounded-[22px] border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.065),rgba(255,255,255,0.025)_45%,rgba(4,4,6,0.86))] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_34px_rgba(0,0,0,0.26)] backdrop-blur-xl transition-colors hover:border-white/16">
      <CardHeader className="border-b border-white/8 bg-white/[0.025] px-4 py-3">
        <CardTitle className="text-xs font-journal uppercase tracking-widest text-white/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PenLine className="h-4 w-4" /> Блокнот
          </div>
          <button 
            onClick={clearAll}
            className="text-[10px] text-white/40 hover:text-white/80 transition-colors"
          >
            ОЧИСТИТЬ
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4 pt-4">
        <div className="space-y-1">
          <label className="text-[10px] text-white/50 flex items-center gap-1.5 uppercase tracking-wider">
            <Map className="h-3 w-3" /> Комната призрака
          </label>
          <input 
            type="text" 
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Например: Кухня"
            className="w-full rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-xs text-white/90 outline-none transition-colors placeholder:text-white/20 focus:border-white/30"
          />
        </div>
        
        <div className="flex gap-3">
          <div className="space-y-1 flex-1">
            <label className="text-[10px] text-white/50 flex items-center gap-1.5 uppercase tracking-wider">
              <Skull className="h-3 w-3" /> Кость
            </label>
            <input 
              type="text" 
              value={bone}
              onChange={(e) => setBone(e.target.value)}
              placeholder="Где кость?"
              className="w-full rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-xs text-white/90 outline-none transition-colors placeholder:text-white/20 focus:border-white/30"
            />
          </div>
          <div className="space-y-1 flex-1">
            <label className="text-[10px] text-white/50 flex items-center gap-1.5 uppercase tracking-wider">
              <Flame className="h-3 w-3" /> Проклятый
            </label>
            <input 
              type="text" 
              value={cursedItem}
              onChange={(e) => setCursedItem(e.target.value)}
              placeholder="Какой предмет?"
              className="w-full rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-xs text-white/90 outline-none transition-colors placeholder:text-white/20 focus:border-white/30"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-white/50 uppercase tracking-wider">
            Заметки
          </label>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Поведение, особенности..."
            className="min-h-[60px] w-full resize-y rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-xs text-white/90 outline-none transition-colors placeholder:text-white/20 focus:border-white/30"
          />
        </div>
      </CardContent>
    </Card>
  );
}
