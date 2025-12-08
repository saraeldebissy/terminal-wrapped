/**
 * Section wrapper with title
 */

import { AnimatedSection } from '../motion/AnimatedSection';
import type { ReactNode } from 'react';

export interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function Section({
  id,
  title,
  subtitle,
  children,
  className = '',
}: SectionProps) {
  return (
    <AnimatedSection id={id} className={`py-16 ${className}`}>
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-50">{title}</h2>
        {subtitle && <p className="text-lg text-slate-400 mt-2">{subtitle}</p>}
      </div>
      {children}
    </AnimatedSection>
  );
}
