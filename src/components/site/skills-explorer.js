'use client';

import { useMemo, useRef, useState } from 'react';
import { 
  Brain, 
  Cloud, 
  Code2, 
  Gauge, 
  Layers, 
  Server, 
  Smartphone, 
  Sparkles, 
  Search, 
  X,
  CheckCircle2 
} from 'lucide-react';
import { cn } from '@/lib/cn';

const DOMAIN_ICONS = {
  'frontend-design': Code2,
  mobile: Smartphone,
  'backend-apis': Server,
  'cloud-devops-security': Cloud,
  'quality-performance': Gauge,
  'ai-engineering': Brain,
  'graphics-3d-web3': Sparkles,
};

// Key production tools highlighted with subtle accent emphasis
const CORE_TOOLS = new Set([
  'TypeScript',
  'TypeScript/JavaScript',
  'JavaScript (ES6+)',
  'React',
  'Next.js',
  'Node.js',
  'PostgreSQL',
  'Python',
  'Tailwind CSS',
  'Docker',
  'React Native',
  'GraphQL',
  'Redis',
  'LangChain',
  'Framer Motion',
  'CI/CD Pipelines',
  'RESTful APIs',
]);

export function SkillsExplorer({ groups }) {
  const [active, setActive] = useState(groups[0]?.id);
  const [searchQuery, setSearchQuery] = useState('');
  const tabRefs = useRef({});

  function select(id) {
    setActive(id);
    tabRefs.current[id]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }

  function onKeyDown(event, index) {
    const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next;
    if (event.key in keys) next = (index + keys[event.key] + groups.length) % groups.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = groups.length - 1;
    else return;
    event.preventDefault();
    const id = groups[next].id;
    select(id);
    tabRefs.current[id]?.focus();
  }

  // Filter skills across all domains when search query is entered
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return null;

    const matches = [];
    for (const group of groups) {
      for (const entry of group.entries) {
        for (const item of entry.items) {
          if (item.toLowerCase().includes(query)) {
            matches.push({
              item,
              category: entry.label || group.name,
              domain: group.name,
              isCore: CORE_TOOLS.has(item),
            });
          }
        }
      }
    }
    return matches;
  }, [groups, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Quick Search & Filter bar */}
      <div className="relative">
        <Search 
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" 
          aria-hidden="true" 
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter toolkit (e.g. React, Next.js, Postgres, Docker, LLM...)"
          className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-10 text-sm text-foreground shadow-2xs placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-full bg-subtle text-muted transition-colors hover:text-foreground"
          >
            <X className="size-3" />
          </button>
        )}
      </div>

      {/* Render Instant Search Results if search query is active */}
      {searchResults !== null ? (
        <div className="rounded-2xl border border-border bg-background p-6 shadow-xs sm:p-8">
          <div className="mb-6 flex items-center justify-between border-b border-border/80 pb-4">
            <h3 className="text-base font-semibold text-foreground">
              Search Results
            </h3>
            <span className="font-mono text-xs text-muted">
              {searchResults.length} {searchResults.length === 1 ? 'match' : 'matches'} found
            </span>
          </div>

          {searchResults.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((result, i) => (
                <div 
                  key={i} 
                  className={`flex flex-col justify-between rounded-xl border p-3.5 transition-all ${
                    result.isCore
                      ? 'border-accent/40 bg-accent-soft/30'
                      : 'border-border/80 bg-surface/50 hover:border-foreground/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {result.item}
                    </span>
                    {result.isCore && (
                      <span className="rounded bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] font-medium text-accent-text">
                        Core Stack
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 font-mono text-[11px] text-muted">
                    <span className="truncate">{result.domain}</span>
                    <span>&middot;</span>
                    <span className="truncate text-muted/70">{result.category}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted">No technologies found matching &ldquo;{searchQuery}&rdquo;</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-3 text-xs font-semibold text-accent-text hover:underline"
              >
                Clear filter & show all domains
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Standard Domain Tabs & Panels view */
        <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
          {/* Domain tabs (horizontal scroll on mobile with right fade mask) */}
          <div className="relative">
            <div 
              className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-8 bg-gradient-to-l from-background to-transparent lg:hidden" 
              aria-hidden="true" 
            />

            <div
              role="tablist"
              aria-label="Skill domains"
              className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 scrollbar-hide sm:mx-0 sm:px-0 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:pb-0"
            >
              {groups.map((group, index) => {
                const selected = group.id === active;
                const DomainIcon = DOMAIN_ICONS[group.id] || Layers;
                return (
                  <button
                    key={group.id}
                    ref={(el) => (tabRefs.current[group.id] = el)}
                    id={`tab-${group.id}`}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    aria-controls={`panel-${group.id}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => select(group.id)}
                    onKeyDown={(e) => onKeyDown(e, index)}
                    className={cn(
                      'group flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl border px-3.5 text-left text-sm font-medium transition-all',
                      'h-11 lg:h-12 lg:w-full',
                      selected
                        ? 'border-border bg-background text-foreground shadow-xs ring-1 ring-border/80'
                        : 'border-transparent text-muted hover:border-border/40 hover:bg-surface hover:text-foreground'
                    )}
                  >
                    <DomainIcon
                      className={cn(
                        'size-4 shrink-0 transition-colors',
                        selected ? 'text-accent-text' : 'text-muted group-hover:text-foreground'
                      )}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    <span className="flex-1 font-medium">{group.name}</span>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums',
                        selected ? 'bg-accent-soft text-accent-text' : 'bg-subtle text-muted'
                      )}
                    >
                      {group.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panels */}
          <div className="min-w-0">
            {groups.map((group) => (
              <div
                key={group.id}
                id={`panel-${group.id}`}
                role="tabpanel"
                aria-labelledby={`tab-${group.id}`}
                hidden={group.id !== active}
                tabIndex={0}
                className="animate-fade-in overflow-hidden rounded-2xl border border-border bg-background shadow-xs focus-visible:ring-offset-0"
              >
                {/* Header bar */}
                <div className="flex items-center justify-between border-b border-border/80 bg-surface/50 px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-foreground">{group.name}</h3>
                    <span className="rounded-full bg-accent-soft px-2 py-0.5 font-mono text-[11px] font-medium text-accent-text">
                      Production Verified
                    </span>
                  </div>
                  <p className="font-mono text-xs text-muted">
                    {group.count} {group.count === 1 ? 'skill' : 'skills'}
                  </p>
                </div>

                {/* Sub-category Cards */}
                <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
                  {group.entries.map((entry, i) => (
                    <div
                      key={entry.label || i}
                      className="flex flex-col justify-between rounded-xl border border-border/70 bg-surface/40 p-4 transition-colors hover:border-border"
                    >
                      <div>
                        {entry.label && (
                          <div className="mb-3 flex items-center justify-between">
                            <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
                              {entry.label}
                            </h4>
                            <span className="font-mono text-[10px] text-muted/60">
                              {entry.items.length}
                            </span>
                          </div>
                        )}
                        <ul className="flex flex-wrap gap-1.5">
                          {entry.items.map((item) => {
                            const isCore = CORE_TOOLS.has(item);
                            return (
                              <li
                                key={item}
                                className={cn(
                                  'inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium transition-all',
                                  isCore
                                    ? 'border border-accent/30 bg-accent-soft/60 text-accent-text shadow-2xs font-semibold'
                                    : 'border border-border/80 bg-background text-foreground hover:border-foreground/30'
                                )}
                              >
                                {isCore && (
                                  <span className="mr-1.5 size-1.5 rounded-full bg-accent" aria-hidden="true" />
                                )}
                                {item}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
