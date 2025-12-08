/**
 * Hero section with main summary stats
 */

import { motion } from 'motion/react';
import type { StatsMeta, TopCommand } from '../../api/types';
import { MetricCard } from '../cards/MetricCard';
import { ConfettiBurst } from '../motion/ConfettiBurst';

export interface HeroSummaryProps {
  meta: StatsMeta;
  topCommand: TopCommand | null;
}

export function HeroSummary({ meta, topCommand }: HeroSummaryProps) {
  const dateRangeText = formatDateRange(meta.dateRange.start, meta.dateRange.end);

  return (
    <section id="hero" className="relative py-16 min-h-[60vh] flex flex-col justify-center">
      {/* Background confetti */}
      <ConfettiBurst count={40} />

      {/* Main heading */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Your Terminal Wrapped
        </h1>
        {dateRangeText && (
          <p className="text-xl text-slate-400 mt-4">{dateRangeText}</p>
        )}
      </motion.div>

      {/* Metric cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <MetricCard
          label="Total Commands"
          value={meta.totalCommands}
          subtitle="commands executed"
          accentColor="primary"
        />

        <MetricCard
          label="Unique Commands"
          value={meta.distinctCommands}
          subtitle="different commands"
          accentColor="secondary"
        />

        {topCommand && (
          <MetricCard
            label="#1 Command"
            value={topCommand.name}
            subtitle={`used ${topCommand.count.toLocaleString()} times`}
            accentColor="accent"
          />
        )}
      </motion.div>
    </section>
  );
}

function formatDateRange(start?: string, end?: string): string {
  if (!start && !end) return '';

  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Check if same year
    if (startDate.getFullYear() === endDate.getFullYear()) {
      return startDate.getFullYear().toString();
    }

    return `${formatShortDate(start)} - ${formatShortDate(end)}`;
  }

  if (start) return `Since ${formatShortDate(start)}`;
  if (end) return `Until ${formatShortDate(end)}`;

  return '';
}

function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}
