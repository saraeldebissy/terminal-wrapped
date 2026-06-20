import type { ColorToken } from '../theme/palette';
import type { Stats } from '../api/types';

export type SlideId =
  | 'cover' | 'volume' | 'type' | 'peakHour'
  | 'busiestDay' | 'flag' | 'countdown' | 'secrets' | 'receipt';

export interface SlideEntry {
  id: SlideId;
  bg: ColorToken;
}

export interface SlideViewProps {
  stats: Stats;
}
