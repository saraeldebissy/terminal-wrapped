/**
 * Calendar heatmap for daily activity
 */

import { motion } from 'motion/react';
import { useMemo } from 'react';
import type { DayActivity } from '../../api/types';

export interface ActivityHeatmapProps {
  data: DayActivity[];
  weeks?: number;
}

const intensityClasses = [
  'bg-slate-800/30',
  'bg-primary/20',
  'bg-primary/40',
  'bg-primary/60',
  'bg-primary/80',
  'bg-primary',
];

export function ActivityHeatmap({ data, weeks = 26 }: ActivityHeatmapProps) {
  const { grid, maxCount, monthLabels } = useMemo(() => {
    // Create a map for quick lookup
    const countMap = new Map<string, number>();
    let max = 0;

    for (const day of data) {
      countMap.set(day.date, day.count);
      max = Math.max(max, day.count);
    }

    // Generate grid for the last N weeks
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (weeks * 7));

    // Align to start of week (Sunday)
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const gridData: { date: string; count: number; dayOfWeek: number }[][] = [];
    const months: { label: string; weekIndex: number }[] = [];
    let currentMonth = -1;

    const current = new Date(startDate);
    let weekIndex = 0;

    while (current <= today) {
      const week: { date: string; count: number; dayOfWeek: number }[] = [];

      for (let day = 0; day < 7; day++) {
        if (current > today) {
          week.push({ date: '', count: 0, dayOfWeek: day });
        } else {
          const dateStr = formatDate(current);
          const month = current.getMonth();

          if (month !== currentMonth) {
            currentMonth = month;
            months.push({
              label: current.toLocaleString('default', { month: 'short' }),
              weekIndex,
            });
          }

          week.push({
            date: dateStr,
            count: countMap.get(dateStr) || 0,
            dayOfWeek: day,
          });
        }

        current.setDate(current.getDate() + 1);
      }

      gridData.push(week);
      weekIndex++;
    }

    return { grid: gridData, maxCount: max, monthLabels: months };
  }, [data, weeks]);

  const getIntensityClass = (count: number): string => {
    if (count === 0) return intensityClasses[0];
    const level = Math.min(
      Math.ceil((count / maxCount) * (intensityClasses.length - 1)),
      intensityClasses.length - 1
    );
    return intensityClasses[level];
  };

  return (
    <div className="space-y-2">
      {/* Month labels */}
      <div className="flex text-xs text-slate-500 ml-8">
        {monthLabels.map((month, i) => (
          <span
            key={i}
            className="flex-shrink-0"
            style={{ marginLeft: i === 0 ? 0 : `${(month.weekIndex - (monthLabels[i - 1]?.weekIndex || 0)) * 14 - 20}px` }}
          >
            {month.label}
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        {/* Day labels */}
        <div className="flex flex-col text-xs text-slate-500 gap-[3px] pt-[2px]">
          <span className="h-[10px]"></span>
          <span className="h-[10px]">Mon</span>
          <span className="h-[10px]"></span>
          <span className="h-[10px]">Wed</span>
          <span className="h-[10px]"></span>
          <span className="h-[10px]">Fri</span>
          <span className="h-[10px]"></span>
        </div>

        {/* Grid */}
        <div className="flex gap-[3px] overflow-x-auto pb-2">
          {grid.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-[3px]">
              {week.map((day, dayIdx) => (
                <motion.div
                  key={`${weekIdx}-${dayIdx}`}
                  className={`w-[10px] h-[10px] rounded-sm ${
                    day.date ? getIntensityClass(day.count) : 'bg-transparent'
                  }`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: (weekIdx * 7 + dayIdx) * 0.002,
                    duration: 0.2,
                  }}
                  title={day.date ? `${day.date}: ${day.count} commands` : ''}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 text-xs text-slate-500">
        <span>Less</span>
        {intensityClasses.map((cls, i) => (
          <div key={i} className={`w-[10px] h-[10px] rounded-sm ${cls}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
