import { motion } from 'motion/react';
import { Ghost } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { evidenceTranslations } from '../utils/translations';
import { Zap, Skull, Ghost as GhostIcon } from 'lucide-react';
import { EvidenceIcon } from './EvidenceIcon';

interface GhostCardProps {
  ghost: Ghost;
  onClick: () => void;
}

export function GhostCard({ ghost, onClick }: GhostCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className="cursor-pointer h-full"
      onClick={onClick}
    >
      <Card className="h-full flex flex-col bg-black/40 backdrop-blur-sm border-white/5 overflow-hidden group hover:border-white/20 transition-colors duration-500 shadow-2xl">
        <CardHeader className="p-5 pb-3 text-left">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-colors group-hover:bg-white/10">
              <GhostIcon className="h-6 w-6 text-white/70 group-hover:text-white" />
            </div>
            <div className="min-w-0 space-y-1">
              <CardTitle className="font-journal text-xl leading-tight text-white/90 group-hover:text-white transition-colors">
                {ghost.name}
              </CardTitle>
              <p className="line-clamp-2 text-xs leading-relaxed text-white/45">
                {ghost.description}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-0 flex flex-col flex-grow space-y-4 text-left">
          <div className="flex flex-wrap gap-1.5">
            {ghost.evidence.map((ev) => (
              <Badge
                key={ev}
                variant="secondary"
                className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-wider bg-white/5 text-white/60 border-white/10 group-hover:border-white/20 group-hover:text-white/80 transition-colors"
              >
                <EvidenceIcon evidence={ev} className="h-3 w-3" />
                <span>{evidenceTranslations[ev]}</span>
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-4 text-[10px] text-white/40 font-mono uppercase tracking-widest mt-auto pt-4 border-t border-white/5">
            <span className="flex items-center gap-1.5" title="Скорость">
              <Zap className="h-3 w-3 text-yellow-500/70" /> {ghost.speedRange || '1.7 m/s'}
            </span>
            <span className="flex items-center gap-1.5" title="Порог охоты">
              <Skull className="h-3 w-3 text-red-500/70" /> {ghost.huntThresholdValue || '50%'}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
