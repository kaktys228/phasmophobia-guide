import type { ComponentType } from 'react';
import { Activity, Hand, NotebookPen, Radio, ScanLine, Snowflake, Sparkles } from 'lucide-react';
import { Evidence } from '../types';
import { cn } from '@/lib/utils';

interface EvidenceIconProps {
  evidence: Evidence;
  className?: string;
}

const EVIDENCE_ICON_MAP = {
  'EMF Level 5': Activity,
  Fingerprints: Hand,
  'Ghost Writing': NotebookPen,
  'Freezing Temperatures': Snowflake,
  'Ghost Orb': Sparkles,
  'Spirit Box': Radio,
  'D.O.T.S. Projector': ScanLine,
} satisfies Record<Evidence, ComponentType<{ className?: string }>>;

const EVIDENCE_ICON_COLORS: Record<Evidence, string> = {
  'EMF Level 5': 'text-cyan-300',
  Fingerprints: 'text-violet-200',
  'Ghost Writing': 'text-amber-200',
  'Freezing Temperatures': 'text-sky-200',
  'Ghost Orb': 'text-yellow-200',
  'Spirit Box': 'text-orange-200',
  'D.O.T.S. Projector': 'text-emerald-200',
};

export function EvidenceIcon({ evidence, className }: EvidenceIconProps) {
  const Icon = EVIDENCE_ICON_MAP[evidence];

  return (
    <Icon
      className={cn(
        'h-3.5 w-3.5 shrink-0',
        EVIDENCE_ICON_COLORS[evidence],
        className,
      )}
    />
  );
}
