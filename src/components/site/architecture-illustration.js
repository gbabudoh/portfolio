'use client';

import { useState, useEffect } from 'react';
import { 
  Globe, 
  Cpu, 
  Database, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  RefreshCw 
} from 'lucide-react';

export function ArchitectureIllustration() {
  const [activeStep, setActiveStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [logMessage, setLogMessage] = useState('System idle · Ready for incoming traffic');

  // Auto-cycle packet pulse through the pipeline
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const triggerSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveStep(0);
    setLogMessage('Incoming client request -> Edge CDN route');

    setTimeout(() => {
      setActiveStep(1);
      setLogMessage('API Gateway authenticating -> Routing to event bus');
    }, 600);

    setTimeout(() => {
      setActiveStep(2);
      setLogMessage('Distributed DB query & AI embeddings resolved');
    }, 1300);

    setTimeout(() => {
      setActiveStep(3);
      setLogMessage('Payload serialized -> 200 OK response sent (14ms)');
    }, 2000);

    setTimeout(() => {
      setIsSimulating(false);
    }, 2800);
  };

  const nodes = [
    {
      id: 'edge',
      title: 'Edge / Client Layer',
      subtitle: 'Next.js 15 · Edge CDN · WebSockets',
      tag: 'Global Edge',
      icon: Globe,
      color: 'text-indigo-500',
      activeStep: 0,
      detail: 'Global Anycast CDN with sub-10ms response times and server-side edge caching.',
    },
    {
      id: 'gateway',
      title: 'API & Microservices',
      subtitle: 'Node / Go · GraphQL · Zero-Trust Auth',
      tag: 'API Gateway',
      icon: Cpu,
      color: 'text-sky-500',
      activeStep: 1,
      detail: 'Auto-scaling stateless services with rate limiting, circuit breakers and event orchestration.',
    },
    {
      id: 'ai',
      title: 'AI Pipeline & Workers',
      subtitle: 'LLM Agents · Vector DB · Async Queue',
      tag: 'AI Engine',
      icon: Sparkles,
      color: 'text-amber-500',
      activeStep: 2,
      detail: 'Streaming inference pipelines with semantic caching and background task scheduling.',
    },
    {
      id: 'data',
      title: 'Distributed Storage',
      subtitle: 'PostgreSQL · Redis KV · Cloud Object',
      tag: 'ACID & Cache',
      icon: Database,
      color: 'text-emerald-500',
      activeStep: 2,
      detail: 'Multi-region replica synchronization with Redis sub-millisecond caching tier.',
    },
  ];

  return (
    <div className="relative mx-auto w-full max-w-xl">
      {/* Ambient background glow */}
      <div 
        className="pointer-events-none absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-accent/20 via-sky-500/10 to-transparent opacity-70 blur-xl" 
        aria-hidden="true" 
      />

      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/95 shadow-xl backdrop-blur-md">
        {/* Top window chrome header */}
        <div className="flex items-center justify-between border-b border-border/80 bg-subtle/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-rose-500/80" />
            <span className="size-2.5 rounded-full bg-amber-500/80" />
            <span className="size-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 font-mono text-xs font-medium text-muted">
              system-architecture.live
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            <span className="font-mono text-[11px] font-medium tracking-wide text-success">
              ACTIVE MESH
            </span>
          </div>
        </div>

        {/* Interactive canvas / diagram body */}
        <div className="relative p-5 sm:p-6">
          {/* Subtle grid background */}
          <div 
            className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.07]" 
            style={{
              backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
            aria-hidden="true"
          />

          {/* Node 1: Edge Client */}
          <div 
            onClick={() => setSelectedNode(selectedNode === 'edge' ? null : 'edge')}
            className={`group relative cursor-pointer rounded-xl border p-3.5 transition-all duration-300 sm:p-4 ${
              activeStep === 0
                ? 'border-accent bg-accent-soft/40 shadow-sm ring-1 ring-accent/30'
                : 'border-border/80 bg-background/80 hover:border-accent/40 hover:bg-subtle/40'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`grid size-9 place-items-center rounded-lg border border-border/60 bg-surface ${
                  activeStep === 0 ? 'text-accent' : 'text-muted group-hover:text-foreground'
                }`}>
                  <Globe className="size-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold tracking-tight text-foreground">
                      Edge / Client Layer
                    </h3>
                    <span className="rounded bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] font-medium text-accent-text">
                      HTTP/3
                    </span>
                  </div>
                  <p className="text-xs text-muted">Next.js 15 · Edge Middleware · SSR</p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono text-xs font-medium text-success">99.98%</span>
                <p className="font-mono text-[10px] text-muted">Cache Hit</p>
              </div>
            </div>

            {selectedNode === 'edge' && (
              <p className="mt-2.5 border-t border-border/60 pt-2 text-xs text-muted animate-fade-in">
                {nodes[0].detail}
              </p>
            )}
          </div>

          {/* Connector 1: Edge -> API */}
          <div className="my-1.5 flex items-center justify-center py-1">
            <div className="relative flex h-7 w-px flex-col items-center justify-center bg-border">
              <div 
                className={`absolute size-2 rounded-full transition-all duration-500 ${
                  activeStep === 0 || activeStep === 1 
                    ? 'bg-accent shadow-[0_0_8px_rgba(99,102,241,0.8)]' 
                    : 'bg-muted/40'
                }`}
                style={{
                  top: activeStep === 0 ? '10%' : activeStep === 1 ? '90%' : '50%',
                }}
              />
            </div>
          </div>

          {/* Node 2: Core API & Gateway */}
          <div 
            onClick={() => setSelectedNode(selectedNode === 'gateway' ? null : 'gateway')}
            className={`group relative cursor-pointer rounded-xl border p-3.5 transition-all duration-300 sm:p-4 ${
              activeStep === 1
                ? 'border-accent bg-accent-soft/40 shadow-sm ring-1 ring-accent/30'
                : 'border-border/80 bg-background/80 hover:border-accent/40 hover:bg-subtle/40'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`grid size-9 place-items-center rounded-lg border border-border/60 bg-surface ${
                  activeStep === 1 ? 'text-accent' : 'text-muted group-hover:text-foreground'
                }`}>
                  <Cpu className="size-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold tracking-tight text-foreground">
                      API Gateway & Core
                    </h3>
                    <span className="rounded bg-sky-500/10 px-1.5 py-0.5 font-mono text-[10px] font-medium text-sky-600 dark:text-sky-400">
                      Gateway
                    </span>
                  </div>
                  <p className="text-xs text-muted">Node / TypeScript · GraphQL · Zero-Trust</p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono text-xs font-medium text-foreground">4ms</span>
                <p className="font-mono text-[10px] text-muted">Avg TTFB</p>
              </div>
            </div>

            {selectedNode === 'gateway' && (
              <p className="mt-2.5 border-t border-border/60 pt-2 text-xs text-muted animate-fade-in">
                {nodes[1].detail}
              </p>
            )}
          </div>

          {/* Split connector: API -> AI & DB */}
          <div className="relative my-2 flex h-8 items-center justify-center">
            {/* SVG branched flow lines */}
            <svg 
              className="h-full w-full max-w-[280px] overflow-visible" 
              viewBox="0 0 280 32" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Branch to left (AI) */}
              <path 
                d="M 140 0 V 12 C 140 22 70 12 70 32" 
                className="stroke-border" 
                strokeWidth="1.5" 
              />
              {/* Branch to right (DB) */}
              <path 
                d="M 140 0 V 12 C 140 22 210 12 210 32" 
                className="stroke-border" 
                strokeWidth="1.5" 
              />

              {/* Animated pulses */}
              {(activeStep === 1 || activeStep === 2) && (
                <>
                  <circle cx="70" cy="24" r="2.5" className="fill-amber-500 animate-ping" />
                  <circle cx="210" cy="24" r="2.5" className="fill-emerald-500 animate-ping" />
                </>
              )}
            </svg>
          </div>

          {/* Bottom Split Layer: AI Engine & Distributed DB */}
          <div className="grid grid-cols-2 gap-3">
            {/* Node 3A: AI & Pipeline */}
            <div 
              onClick={() => setSelectedNode(selectedNode === 'ai' ? null : 'ai')}
              className={`group relative cursor-pointer rounded-xl border p-3 transition-all duration-300 sm:p-3.5 ${
                activeStep === 2
                  ? 'border-amber-500/70 bg-amber-500/5 shadow-sm ring-1 ring-amber-500/30'
                  : 'border-border/80 bg-background/80 hover:border-amber-500/40 hover:bg-subtle/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`grid size-7 shrink-0 place-items-center rounded-md border border-border/60 bg-surface ${
                  activeStep === 2 ? 'text-amber-500' : 'text-muted group-hover:text-amber-500'
                }`}>
                  <Sparkles className="size-3.5" />
                </div>
                <div className="min-w-0">
                  <h4 className="truncate text-xs font-semibold text-foreground">AI Workflows</h4>
                  <p className="truncate font-mono text-[10px] text-muted">Vector & Agents</p>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between font-mono text-[10px]">
                <span className="text-muted">Streaming</span>
                <span className="font-semibold text-amber-500">Live</span>
              </div>
            </div>

            {/* Node 3B: Database Layer */}
            <div 
              onClick={() => setSelectedNode(selectedNode === 'data' ? null : 'data')}
              className={`group relative cursor-pointer rounded-xl border p-3 transition-all duration-300 sm:p-3.5 ${
                activeStep === 2 || activeStep === 3
                  ? 'border-emerald-500/70 bg-emerald-500/5 shadow-sm ring-1 ring-emerald-500/30'
                  : 'border-border/80 bg-background/80 hover:border-emerald-500/40 hover:bg-subtle/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`grid size-7 shrink-0 place-items-center rounded-md border border-border/60 bg-surface ${
                  activeStep === 2 || activeStep === 3 ? 'text-emerald-500' : 'text-muted group-hover:text-emerald-500'
                }`}>
                  <Database className="size-3.5" />
                </div>
                <div className="min-w-0">
                  <h4 className="truncate text-xs font-semibold text-foreground">PostgreSQL</h4>
                  <p className="truncate font-mono text-[10px] text-muted">Redis Cache</p>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between font-mono text-[10px]">
                <span className="text-muted">Persistence</span>
                <span className="font-semibold text-emerald-500">ACID</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer telemetry & live simulate request trigger */}
        <div className="flex flex-col gap-2.5 border-t border-border/80 bg-subtle/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-mono text-xs text-muted">
            <span className="size-1.5 rounded-full bg-accent" />
            <span className="truncate">{logMessage}</span>
          </div>

          <button
            type="button"
            onClick={triggerSimulation}
            disabled={isSimulating}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground transition-all hover:border-accent hover:text-accent-text disabled:opacity-50"
          >
            <RefreshCw className={`size-3 ${isSimulating ? 'animate-spin text-accent' : ''}`} />
            {isSimulating ? 'Tracing...' : 'Trace Request'}
          </button>
        </div>
      </div>
    </div>
  );
}
