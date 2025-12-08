/**
 * 24-hour activity pattern bar chart
 */

import { motion } from 'motion/react';
import type { HourActivity } from '../../api/types';

export interface HourlyPatternBarChartProps {
  data: HourActivity[];
}

export function HourlyPatternBarChart({ data }: HourlyPatternBarChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  // Find peak hour
  const peakHour = data.reduce((peak, curr) =>
    curr.count > peak.count ? curr : peak
  , data[0]);

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="flex items-end justify-between h-40 gap-1">
        {data.map((item, index) => {
          const height = (item.count / maxCount) * 100;
          const isPeak = item.hour === peakHour?.hour;

          return (
            <motion.div
              key={item.hour}
              className="flex-1 flex flex-col items-center gap-1"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.02 }}
            >
              {/* Bar */}
              <motion.div
                className={`w-full rounded-t-sm ${
                  isPeak
                    ? 'bg-gradient-to-t from-primary to-secondary'
                    : 'bg-slate-600/50'
                }`}
                initial={{ height: 0 }}
                whileInView={{ height: `${Math.max(height, 2)}%` }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.02 + 0.2, duration: 0.5, ease: 'easeOut' }}
                style={{ minHeight: item.count > 0 ? '4px' : '0px' }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-slate-500">
        <span>12am</span>
        <span>6am</span>
        <span>12pm</span>
        <span>6pm</span>
        <span>11pm</span>
      </div>

      {/* Peak indicator */}
      {peakHour && peakHour.count > 0 && (
        <p className="text-sm text-slate-400 text-center">
          Peak activity at{' '}
          <span className="text-primary font-medium">
            {formatHour(peakHour.hour)}
          </span>
          {' '}with {peakHour.count.toLocaleString()} commands
        </p>
      )}
    </div>
  );
}

function formatHour(hour: number): string {
  if (hour === 0) return '12am';
  if (hour === 12) return '12pm';
  if (hour < 12) return `${hour}am`;
  return `${hour - 12}pm`;
}
