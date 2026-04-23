import { Ghost } from '../types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { GhostInfoPanel } from './GhostInfoPanel';

interface GhostInfoDialogProps {
  ghost: Ghost | null;
  onClose: () => void;
}

export function GhostInfoDialog({ ghost, onClose }: GhostInfoDialogProps) {
  if (!ghost) {
    return null;
  }

  return (
    <Dialog open={Boolean(ghost)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-none overflow-y-auto border-white/10 bg-[#0b0b0d]/95 p-0 text-white shadow-[0_28px_120px_rgba(0,0,0,0.72)] backdrop-blur-xl sm:max-w-[1180px] xl:w-[1180px]">
        <GhostInfoPanel ghost={ghost} />
      </DialogContent>
    </Dialog>
  );
}
