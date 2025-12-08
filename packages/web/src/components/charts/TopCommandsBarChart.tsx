/**
 * Horizontal bar chart for top commands
 */

import { motion } from 'motion/react';
import type { TopCommand } from '../../api/types';

export interface TopCommandsBarChartProps {
  commands: TopCommand[];
  maxItems?: number;
}

export function TopCommandsBarChart({
  commands,
  maxItems = 10,
}: TopCommandsBarChartProps) {
  const displayCommands = commands.slice(0, maxItems);

  return (
    <div className="space-y-3">
      {displayCommands.map((cmd, index) => (
        <motion.div
          key={cmd.name}
          className="relative"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05, duration: 0.4 }}
        >
          {/* Bar container */}
          <div className="relative h-10 bg-slate-800/30 rounded-lg overflow-hidden">
            {/* Animated bar fill */}
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/80 to-secondary/60 rounded-lg"
              initial={{ width: 0 }}
              whileInView={{ width: `${cmd.percentile * 100}%` }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 + 0.2, duration: 0.8, ease: 'easeOut' }}
            />

            {/* Label and count */}
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <span className="font-mono text-sm font-medium text-slate-50 z-10">
                {cmd.name}
              </span>
              <span className="text-sm text-slate-300 z-10">
                {cmd.count.toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
