import type { SlideViewProps } from './types';
import { copy } from './copy';

export function FlagSlide({ stats }: SlideViewProps) {
  const flag = stats.parameters.topFlags[0];
  return (
    <div>
      <p className="font-display font-bold text-lg md:text-2xl text-white/80">{copy.flagKicker}</p>
      <p className="font-mono text-coral font-bold leading-none mt-2"
         style={{ fontSize: 'clamp(4rem, 18vw, 12rem)' }}>
        {flag.flag}
      </p>
      <p className="mt-4 font-display font-bold text-lg md:text-2xl">{copy.flagAside}</p>
    </div>
  );
}
