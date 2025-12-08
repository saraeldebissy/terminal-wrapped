/**
 * Single metric display card with glass effect
 */

import { motion } from 'motion/react';
import type { ReactNode } from 'react';

export interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  accentColor?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

const accentClasses = {
  primary: 'text-primary drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]',
  secondary: 'text-secondary drop-shadow-[0_0_10px_rgba(20,184,166,0.5)]',
  accent: 'text-accent drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]',
};

export function MetricCard({
  label,
  value,
  subtitle,
  icon,
  accentColor = 'primary',
  className = '',
}: MetricCardProps) {
  const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;

  return (
    <motion.div
      className={`
        bg-slate-800/30 backdrop-blur-md border border-slate-700/50
        rounded-xl p-6
        ${className}
      `}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm uppercase tracking-wider text-slate-400">{label}</p>
          <p className={`text-4xl font-bold mt-2 ${accentClasses[accentColor]}`}>
            {formattedValue}
          </p>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {icon && <div className="text-slate-500">{icon}</div>}
      </div>
    </motion.div>
  );
}
