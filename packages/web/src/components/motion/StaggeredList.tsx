/**
 * Staggered animation for list items
 */

import { motion } from 'motion/react';
import type { ReactNode } from 'react';

export interface StaggeredListProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export interface StaggeredItemProps {
  children: ReactNode;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

export function StaggeredList({
  children,
  staggerDelay = 0.1,
  className = '',
}: StaggeredListProps) {
  const customContainerVariants = {
    ...containerVariants,
    visible: {
      ...containerVariants.visible,
      transition: {
        ...containerVariants.visible.transition,
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={customContainerVariants}
    >
      {children}
    </motion.div>
  );
}

export function StaggeredItem({ children, className = '' }: StaggeredItemProps) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
