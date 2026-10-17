import { ArrowRight, Compass, Layers, Sparkles } from 'lucide-react';
import { getAbout, getSkillGroups, getStats } from '@/lib/content';
import { site } from '@/lib/site';
import { cn } from '@/lib/cn';
import { ButtonLink } from '@/components/ui/button';
import { CtaBand, PageHeader, Section, SectionHeader } from '@/components/site/blocks';
import { SkillsExplorer } from '@/components/site/skills-explorer';
import { EngineerSnapshot } from '@/components/site/engineer-snapshot';

export const revalidate = 3600;

export const metadata = {
  title: 'About',
  description: 'Background, experience and technical expertise across web, mobile, cloud and AI engineering.',
  alternates: { canonical: '/about' },
};

const STORY_SECTIONS = ['experience_paragraph', 'specialization', 'ai_integration'];

const PILLAR_META = {
  experience_paragraph: {
    index: '01',
    eyebrow: 'Track Record',
    icon: Layers,
    accent: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    tags: ['6+ Years Shipped', 'Full-Cycle Ownership', 'High-Uptime Systems'],
  },
  specialization: {
    index: '02',
    eyebrow: 'Core Focus',
    icon: Compass,
    accent: 'text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20',
    tags: ['System Architecture', 'Web & Mobile', 'Product Strategy'],
  },
  ai_integration: {
    index: '03',
    eyebrow: 'Modern DX',
    icon: Sparkles,
    accent: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
    tags: ['Agentic Workflows', 'LLM Integration', 'High-Velocity Delivery'],
  },
};

export default function AboutPage() {
  const about = getAbout();
  const skillGroups = getSkillGroups();
  const stats = getStats();

  // Only verifiable proof points; vanity metrics are intentionally excluded.
  const statByKey = Object.fromEntries(stats.map((s) => [s.key, s.value]));
  const proof = [
    statByKey.years_experience && `${statByKey.years_experience} yrs`,
    statByKey.production_projects && `${statByKey.production_projects} projects shipped`,
  ].filter(Boolean);

  const story = STORY_SECTIONS.map((key) => about[key]).filter(Boolean);

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Product-minded engineering, end to end."
        description={about.main_description?.content}
        aside={<EngineerSnapshot />}
      >
        {/* Identity: Polished trust card with structured proof chips */}
        <div className="rounded-2xl border border-border bg-surface/80 p-4 shadow-xs backdrop-blur-xs sm:p-5">
          <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5 sm:gap-4">
              <div className="relative size-12 shrink-0 sm:size-14">
                <div className="grid size-full place-items-center rounded-full bg-gradient-to-br from-accent via-accent-text to-indigo-900 text-lg font-bold text-white shadow-sm ring-2 ring-accent/30 sm:text-xl">
                  {site.name.charAt(0)}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
                  <span className="relative size-3 rounded-full border-2 border-background bg-success" />
                </span>
              </div>

              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
                    {site.fullName}
                  </h2>
                  <span className="rounded-full bg-success/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-success sm:text-xs">
                    Active
                  </span>
                </div>
                <p className="truncate text-xs font-medium text-muted sm:text-sm">
                  {site.role}
                </p>
              </div>
            </div>

            {/* Structured proof & availability chips (wraps cleanly on mobile) */}
            <div className="flex flex-wrap items-center gap-1.5 border-t border-border/50 pt-2.5 sm:border-t-0 sm:pt-0 sm:gap-2">
              {proof.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-md border border-border bg-background px-2.5 py-1 font-mono text-[11px] font-medium text-foreground"
                >
                  {item}
                </span>
              ))}
              <span className="inline-flex items-center gap-1.5 rounded-md border border-success/30 bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success">
                <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
                {site.availability}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons with mobile-first thumb sizing */}
        <div className="flex flex-col gap-2.5 pt-1 sm:flex-row sm:items-center">
          <ButtonLink href="/contact" size="md" className="w-full sm:w-auto">
            Work with me
            <ArrowRight />
          </ButtonLink>
          <ButtonLink href="/work" size="md" variant="secondary" className="w-full sm:w-auto">
            See projects
          </ButtonLink>
        </div>
      </PageHeader>

      {/* What I bring — three pillars as a scannable card grid */}
      {story.length > 0 && (
        <Section>
          <SectionHeader
            eyebrow="Background"
            title="What I bring"
            description="Three strengths that shape every engagement, from first architecture decision to launch."
          />
          <ul className="grid gap-4 md:grid-cols-3">
            {story.map((item) => {
              const meta = PILLAR_META[item.section] || {
                index: '01',
                eyebrow: 'Capability',
                icon: Layers,
                accent: 'text-accent bg-accent-soft border-accent/20',
                tags: [],
              };
              const PillarIcon = meta.icon;

              return (
                <li
                  key={item.section}
                  className="group relative flex flex-col justify-between rounded-xl border border-border bg-background p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-md sm:p-7"
                >
                  <div className="space-y-4">
                    {/* Top Row: Icon + Eyebrow + Monospace Index */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className={cn('grid size-10 place-items-center rounded-lg border', meta.accent)}>
                          <PillarIcon className="size-5" strokeWidth={2} aria-hidden="true" />
                        </span>
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted">
                          {meta.eyebrow}
                        </span>
                      </div>

                      <span className="font-mono text-xs font-semibold text-muted/60 transition-colors group-hover:text-foreground">
                        {meta.index}
                      </span>
                    </div>

                    {/* Title & Narrative */}
                    <div className="space-y-2">
                      {item.title && (
                        <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent-text sm:text-xl">
                          {item.title}
                        </h3>
                      )}
                      <p className="text-pretty text-sm leading-relaxed text-muted sm:text-base">
                        {item.content}
                      </p>
                    </div>
                  </div>

                  {/* Concrete Proof / Capability Chips */}
                  {meta.tags && meta.tags.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-1.5 border-t border-border/60 pt-4">
                      {meta.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-[11px] font-medium text-foreground transition-colors group-hover:border-foreground/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      {/* Skills */}
      {skillGroups.length > 0 && (
        <Section id="skills" className="border-t border-border bg-surface">
          <SectionHeader
            eyebrow="Expertise"
            title="Technical toolkit"
            description="A production-grade stack spanning the interface, the API and the infrastructure underneath."
          />
          <SkillsExplorer groups={skillGroups} />
        </Section>
      )}

      <CtaBand />
    </>
  );
}
