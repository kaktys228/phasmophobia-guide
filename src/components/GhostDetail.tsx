import { useState, useRef, useEffect } from 'react';
import { Ghost } from '../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Shield, Zap, Info, Play, Square, Ghost as GhostIcon } from 'lucide-react';
import { evidenceTranslations } from '../utils/translations';
import { EvidenceIcon } from './EvidenceIcon';

interface GhostDetailProps {
  ghost: Ghost | null;
  isOpen: boolean;
  onClose: () => void;
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

function FootstepPlayer({ speedStates }: { speedStates?: { speed: number; label: string }[] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [selectedSpeedIndex, setSelectedSpeedIndex] = useState(0);

  const currentSpeed = speedStates && speedStates.length > 0 ? speedStates[selectedSpeedIndex].speed : 1.7;

  useEffect(() => {
    if (audioRef.current) {
      const rate = currentSpeed / 1.7;
      audioRef.current.playbackRate = Math.max(0.5, Math.min(rate, 4.0));
    }
  }, [currentSpeed]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    audioRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col gap-3 mt-3 pt-3 border-t border-white/5">
      {speedStates && speedStates.length > 1 && (
        <div className="space-y-1.5">
          <label className="text-xs text-white/50">Выберите базовую скорость</label>
          <Select
            value={selectedSpeedIndex.toString()}
            onValueChange={(val) => setSelectedSpeedIndex(parseInt(val, 10))}
          >
            <SelectTrigger className="w-full bg-white/5 border-white/10 text-white h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
              {speedStates.map((state, idx) => (
                <SelectItem key={idx} value={idx.toString()} className="focus:bg-white/10 focus:text-white">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{state.speed} м/с</span>
                    <span className="text-xs text-white/50">{state.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex items-center gap-2">
        <audio
          ref={audioRef}
          src="https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3"
          loop
        />
        <button
          onClick={togglePlay}
          className={`flex items-center gap-2 text-xs transition-all px-3 py-2 rounded-md text-white/90 w-full justify-center ${
            isPlaying
              ? 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 animate-pulse'
              : 'bg-white/10 hover:bg-white/20 border border-transparent'
          }`}
        >
          {isPlaying ? <Square className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          {isPlaying ? 'Остановить шаги' : 'Послушать шаги'}
        </button>
      </div>
    </div>
  );
}

export function GhostDetail({ ghost, isOpen, onClose }: GhostDetailProps) {
  if (!ghost) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#0a0a0a] border-white/10 text-white p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="border-b border-white/5 bg-white/[0.02] p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <GhostIcon className="h-8 w-8 text-white/70" />
            </div>
            <div className="space-y-1 text-left">
              <DialogTitle className="font-journal text-4xl">
                {ghost.name}
              </DialogTitle>
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-white/40">
                Призрак • Phasmophobia
              </p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] p-6 pt-0">
          <div className="space-y-6 pt-6">
            <section>
              <p className="text-white/80 leading-relaxed italic font-journal text-lg">
                "{ghost.description}"
              </p>
            </section>

            <Separator className="bg-white/10" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/50">
                  <Zap className="h-4 w-4 text-yellow-500" /> Сильные стороны
                </h3>
                <p className="text-sm text-white/90 bg-white/5 p-3 rounded-md border border-white/5">
                  {ghost.strength}
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/50">
                  <Shield className="h-4 w-4 text-blue-500" /> Слабые стороны
                </h3>
                <p className="text-sm text-white/90 bg-white/5 p-3 rounded-md border border-white/5">
                  {ghost.weakness}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
                  Скорость
                </h3>
                <div className="text-sm text-white/90 bg-white/5 p-3 rounded-md border border-white/5 flex flex-col">
                  <div className="flex justify-between items-center">
                    <span>{ghost.speedRange || '1.7 м/с'}</span>
                    <div className="flex gap-1">
                      {ghost.speed.map((speed) => (
                        <Badge key={speed} variant="outline" className="text-[10px]">
                          {speedMap[speed] || speed}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <FootstepPlayer speedStates={ghost.speedStates} />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
                  Порог охоты
                </h3>
                <div className="text-sm text-white/90 bg-white/5 p-3 rounded-md border border-white/5 flex justify-between items-center">
                  <span>{ghost.huntThresholdValue || '50%'}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {thresholdMap[ghost.huntThreshold] || ghost.huntThreshold}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/50">
                <AlertCircle className="h-4 w-4 text-red-500" /> Улики
              </h3>
              <div className="flex flex-wrap gap-2">
                {ghost.evidence.map((ev) => (
                  <Badge
                    key={ev}
                    variant="outline"
                    className="inline-flex items-center gap-1.5 bg-white/5 border-white/20 text-white px-3 py-1"
                  >
                    <EvidenceIcon evidence={ev} className="h-3 w-3" />
                    <span>{evidenceTranslations[ev]}</span>
                  </Badge>
                ))}
              </div>
            </div>

            {ghost.behaviorFacts && ghost.behaviorFacts.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
                  Поведение
                </h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-white/80">
                  {ghost.behaviorFacts.map((fact, index) => (
                    <li key={index}>{fact}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
                Особенности
              </h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-white/80">
                {ghost.abilities.map((ability, index) => (
                  <li key={index}>{ability}</li>
                ))}
              </ul>
            </div>

            {ghost.strategies && ghost.strategies.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
                  Стратегии
                </h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-white/80">
                  {ghost.strategies.map((strategy, index) => (
                    <li key={index}>{strategy}</li>
                  ))}
                </ul>
              </div>
            )}

            {ghost.hiddenFacts && ghost.hiddenFacts.length > 0 && (
              <div className="space-y-3 bg-white/5 p-4 rounded-lg border border-dashed border-white/20">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-red-400/80 flex items-center gap-2">
                  <Info className="h-4 w-4" /> Скрытые факты
                </h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-white/70">
                  {ghost.hiddenFacts.map((fact, index) => (
                    <li key={index}>{fact}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
