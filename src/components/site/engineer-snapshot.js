'use client';

import { useState, useEffect } from 'react';
import { 
  Check, 
  Copy, 
  MapPin, 
  Clock, 
  Terminal, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ExternalLink 
} from 'lucide-react';
import { site } from '@/lib/site';

export function EngineerSnapshot() {
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState('');

  // Live London / UK Time
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Europe/London',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(now);
        setTime(formatted);
      } catch {
        setTime('London, UK');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const principles = [
    {
      icon: ShieldCheck,
      title: 'Architecture before code',
      desc: 'Robust data schemas, clean API boundaries, and low-latency edge routing.',
    },
    {
      icon: Sparkles,
      title: 'AI-accelerated craftsmanship',
      desc: 'Pairing modern agentic workflows with strict typing and unit tests.',
    },
    {
      icon: Zap,
      title: 'Full-cycle accountability',
      desc: 'Direct ownership from initial system design to continuous production monitoring.',
    },
  ];

  const primaryStack = [
    'Next.js 15',
    'TypeScript',
    'Node.js',
    'PostgreSQL',
    'React Native',
    'Docker / Cloud',
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Subtle ambient background glow */}
      <div 
        className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-tr from-accent/15 via-transparent to-sky-500/10 opacity-70 blur-xl" 
        aria-hidden="true" 
      />

      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/90 shadow-lg backdrop-blur-md">
        {/* Terminal / Card Header */}
        <div className="flex items-center justify-between border-b border-border/70 bg-subtle/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-rose-500/80" />
            <span className="size-2.5 rounded-full bg-amber-500/80" />
            <span className="size-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 font-mono text-xs font-medium text-muted">
              engineer.snapshot
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-muted">
            <Clock className="size-3 text-accent" />
            <span>{time ? `${time} London` : 'UTC+0'}</span>
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          {/* Location & Timezone banner */}
          <div className="flex items-center justify-between rounded-xl border border-border/80 bg-background/80 px-3.5 py-2.5">
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="size-3.5 text-accent" />
              <span className="font-medium text-foreground">{site.location}</span>
            </div>
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium text-success">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              Async & Live
            </span>
          </div>

          {/* Working Principles */}
          <div className="space-y-3">
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
              Engineering DNA
            </h3>
            <ul className="space-y-2.5">
              {principles.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <li key={idx} className="flex items-start gap-3 rounded-lg border border-border/50 bg-background/60 p-2.5 transition-colors hover:border-accent/30">
                    <div className="grid size-6 shrink-0 place-items-center rounded-md bg-accent-soft text-accent-text mt-0.5">
                      <Icon className="size-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-foreground">{item.title}</h4>
                      <p className="text-[11px] leading-relaxed text-muted mt-0.5">{item.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Core Daily Toolkit */}
          <div className="space-y-2.5">
            <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
              Daily Drivers
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {primaryStack.map((tech) => (
                <span 
                  key={tech}
                  className="inline-flex items-center rounded-md border border-border bg-background px-2.5 py-1 font-mono text-[11px] font-medium text-foreground shadow-2xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Quick Action Bar */}
        <div className="flex items-center justify-between border-t border-border/70 bg-subtle/40 px-4 py-3">
          <span className="font-mono text-xs text-muted truncate max-w-[180px] sm:max-w-none">
            {site.email}
          </span>

          <button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:border-accent hover:text-accent-text"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-success" />
                <span className="text-success font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5 text-muted" />
                <span>Copy email</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
