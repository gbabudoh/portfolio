'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/cn';
import { ProjectGrid } from '@/components/site/blocks';

export function WorkBrowser({ projects }) {
  const [category, setCategory] = useState('All');

  const categories = useMemo(() => {
    const counts = new Map();
    for (const p of projects) counts.set(p.category, (counts.get(p.category) || 0) + 1);
    return [['All', projects.length], ...counts.entries()];
  }, [projects]);

  const visible = category === 'All' ? projects : projects.filter((p) => p.category === category);

  return (
    <>
      {/* Category filter: one swipeable row on phones; wraps from sm up so every pill is fully visible */}
      <div className="relative mb-6 sm:mb-8">
        {/* Right fade mask to indicate more scrollable categories on small screens */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-l from-background to-transparent sm:hidden"
          aria-hidden="true"
        />

        <div className="-mx-5 overflow-x-auto px-5 scrollbar-hide sm:mx-0 sm:overflow-visible sm:px-0">
          <div role="group" aria-label="Filter by category" className="flex w-max items-center gap-2 py-1 sm:w-auto sm:flex-wrap">
            {categories.map(([name, count]) => {
              const active = name === category;
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(name)}
                  className={cn(
                    'inline-flex min-h-[42px] items-center gap-2 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20',
                    active
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border bg-background text-muted hover:border-foreground/30 hover:text-foreground'
                  )}
                >
                  <span>{name}</span>
                  <span
                    className={cn(
                      'inline-flex size-5 items-center justify-center rounded-full font-mono text-[11px] font-semibold',
                      active ? 'bg-background/20 text-background' : 'bg-subtle text-muted'
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live status feedback */}
      <div className="mb-6 flex items-center justify-between text-xs text-muted">
        <p aria-live="polite">
          Showing <span className="font-semibold text-foreground">{visible.length}</span> {visible.length === 1 ? 'project' : 'projects'}
          {category !== 'All' && (
            <span> in <span className="font-semibold text-foreground">{category}</span></span>
          )}
        </p>

        {category !== 'All' && (
          <button
            type="button"
            onClick={() => setCategory('All')}
            className="font-medium text-accent-text hover:underline"
          >
            Show all projects &rarr;
          </button>
        )}
      </div>

      {visible.length > 0 ? (
        <ProjectGrid projects={visible} priorityCount={3} />
      ) : (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted">No projects found in this category.</p>
          <button
            type="button"
            onClick={() => setCategory('All')}
            className="mt-3 text-xs font-semibold text-accent-text hover:underline"
          >
            View all projects
          </button>
        </div>
      )}
    </>
  );
}
