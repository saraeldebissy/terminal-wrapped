import type { SlideViewProps } from './types';
import { copy, hourLabel } from './copy';

export function PeakHourSlide({ stats }: SlideViewProps) {
  const peak = [...stats.activityByHour].sort((a, b) => b.count - a.count)[0];
  return (
    <div>
      <p className="font-display font-bold text-lg md:text-2xl">{copy.peakKicker}</p>
      <p className="font-display font-extrabold leading-none mt-2"
         style={{ fontSize: 'clamp(4rem, 20vw, 14rem)' }}>
        {hourLabel(peak.hour)}
      </p>
      <p className="mt-4 font-display font-bold text-lg md:text-2xl text-white/80">{copy.peakAside}</p>
    </div>
  );
}
