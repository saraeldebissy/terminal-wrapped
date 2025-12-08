/**
 * Celebratory confetti burst animation
 */

import { motion } from 'motion/react';
import { useMemo } from 'react';

export interface ConfettiBurstProps {
  count?: number;
  colors?: string[];
  trigger?: boolean;
}

const defaultColors = [
  '#a855f7', // primary purple
  '#14b8a6', // secondary teal
  '#22c55e', // accent green
  '#f97316', // orange
  '#ec4899', // pink
  '#3b82f6', // blue
];

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
}

export function ConfettiBurst({
  count = 30,
  colors = defaultColors,
  trigger = true,
}: ConfettiBurstProps) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
      rotation: Math.random() * 720 - 360,
      scale: Math.random() * 0.5 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, [count, colors]);

  if (!trigger) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="relative w-full h-full">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute left-1/2 top-1/2 w-3 h-3 rounded-sm"
            style={{ backgroundColor: particle.color }}
            initial={{
              x: 0,
              y: 0,
              scale: 0,
              opacity: 0,
              rotate: 0,
            }}
            animate={{
              x: particle.x,
              y: particle.y,
              scale: [0, particle.scale, particle.scale, 0],
              opacity: [0, 1, 1, 0],
              rotate: particle.rotation,
            }}
            transition={{
              duration: 2,
              ease: 'easeOut',
              times: [0, 0.2, 0.8, 1],
            }}
          />
        ))}
      </div>
    </div>
  );
}
