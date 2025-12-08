/**
 * Category frequency bar chart
 */

import { motion } from 'motion/react';
import type { Category } from '../../api/types';

export interface CategoryBarChartProps {
  categories: Category[];
  maxItems?: number;
}

const categoryColors: Record<string, string> = {
  vcs: 'from-orange-500 to-orange-600',
  pkg: 'from-blue-500 to-blue-600',
  runtime: 'from-green-500 to-green-600',
  devops: 'from-purple-500 to-purple-600',
  remote: 'from-cyan-500 to-cyan-600',
  editor: 'from-pink-500 to-pink-600',
  files: 'from-yellow-500 to-yellow-600',
  shell: 'from-slate-500 to-slate-600',
};

export function CategoryBarChart({
  categories,
  maxItems = 8,
}: CategoryBarChartProps) {
  const displayCategories = categories.slice(0, maxItems);
  const maxCount = Math.max(...displayCategories.map((c) => c.count), 1);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {displayCategories.map((category, index) => {
        const heightPercent = (category.count / maxCount) * 100;
        const colorClass = categoryColors[category.slug] || 'from-slate-500 to-slate-600';

        return (
          <motion.div
            key={category.slug}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Bar container */}
            <div className="w-full h-32 flex items-end justify-center">
              <motion.div
                className={`w-12 rounded-t-lg bg-gradient-to-t ${colorClass}`}
                initial={{ height: 0 }}
                whileInView={{ height: `${Math.max(heightPercent, 10)}%` }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.6, ease: 'easeOut' }}
              />
            </div>

            {/* Label */}
            <p className="mt-2 text-sm font-medium text-slate-200 text-center">
              {category.name}
            </p>
            <p className="text-xs text-slate-500">
              {category.count.toLocaleString()}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
