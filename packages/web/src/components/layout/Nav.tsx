/**
 * Sticky navigation with section anchors
 */

import { useState, useEffect } from 'react';

export interface NavItem {
  id: string;
  label: string;
}

export interface NavProps {
  items: NavItem[];
}

export function Nav({ items }: NavProps) {
  const [activeSection, setActiveSection] = useState<string>(items[0]?.id || '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      }
    );

    // Observe all sections
    for (const item of items) {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    }

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <span className="text-sm font-semibold text-slate-200">
            Terminal Wrapped
          </span>
          <div className="flex gap-1 overflow-x-auto">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className={`
                  px-3 py-1.5 text-sm rounded-md transition-colors whitespace-nowrap
                  ${activeSection === item.id
                    ? 'text-primary bg-primary/10'
                    : 'text-slate-400 hover:text-slate-200'
                  }
                `}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
