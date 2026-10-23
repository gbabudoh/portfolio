import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ImageOff } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Badge } from '@/components/ui/badge';

export function Section({ className, children, ...props }) {
  return (
    <section className={cn('py-14 sm:py-24 lg:py-28', className)} {...props}>
      <div className="container">{children}</div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, description, action, className }) {
  return (
    <div className={cn('mb-10 flex flex-col gap-6 sm:mb-14 md:flex-row md:items-end md:justify-between', className)}>
      <div className="max-w-2xl space-y-3">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="text-h2">{title}</h2>
        {description && <p className="text-pretty text-muted sm:text-lg">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, aside, children }) {
  if (aside) {
    return (
      <div className="border-b border-border">
        <div className="container py-8 sm:py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
            <div className="space-y-4 sm:space-y-5 animate-fade-up lg:col-span-7">
              {eyebrow && <p className="eyebrow">{eyebrow}</p>}
              <h1 className="text-h1">{title}</h1>
              {description && <p className="text-pretty text-base text-muted sm:text-lg lg:text-xl">{description}</p>}
              {children}
            </div>
            <div className="animate-fade-up [animation-delay:150ms] lg:col-span-5">
              {aside}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-border">
      <div className="container py-8 sm:py-16 lg:py-20">
        <div className="max-w-3xl animate-fade-up space-y-4 sm:space-y-5">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="text-h1">{title}</h1>
          {description && <p className="text-pretty text-base text-muted sm:text-lg lg:text-xl">{description}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}

const CLOUDINARY_HOST = 'res.cloudinary.com';

export function ProjectImage({ src, alt, priority, sizes, className }) {
  if (!src) {
    return (
      <div className={cn('grid place-items-center bg-subtle text-muted', className)}>
        <ImageOff className="size-6" aria-hidden="true" />
      </div>
    );
  }

  let optimizable = false;
  try {
    optimizable = new URL(src).hostname === CLOUDINARY_HOST;
  } catch {}

  return (
    <div className={cn('relative overflow-hidden bg-subtle', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        unoptimized={!optimizable}
        className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
      />
    </div>
  );
}

// Big-number proof, used on cards and the case-study results strip.
// Label comes first in the DOM (dt before dd) but is shown under the value.
export function ResultList({ results, size = 'md', className }) {
  return (
    <dl className={className}>
      {results.map((r) => (
        <div key={`${r.value}-${r.label}`} className="flex min-w-0 flex-col-reverse gap-1">
          <dt className={cn('text-muted', size === 'lg' ? 'text-sm' : 'text-xs leading-snug')}>{r.label}</dt>
          <dd
            className={cn(
              'font-semibold tracking-tight tabular-nums text-foreground',
              size === 'lg' ? 'text-3xl sm:text-4xl' : 'text-2xl'
            )}
          >
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

const CARD_STACK_LIMIT = 4;

export function ProjectCard({ project, priority = false }) {
  const extraStack = project.stack.length - CARD_STACK_LIMIT;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-background shadow-xs transition-all duration-300 hover:border-foreground/30 hover:shadow-md">
      <ProjectImage
        src={project.image}
        alt=""
        priority={priority}
        sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
        className="aspect-[16/10] border-b border-border/80"
      />
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-muted">
            {project.category}
          </span>
          {project.featured && <Badge tone="accent">Featured</Badge>}
        </div>
        <h3 className="text-lg font-semibold tracking-tight leading-snug transition-colors group-hover:text-accent-text sm:text-xl">
          <Link href={`/work/${project.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {project.title}
          </Link>
        </h3>
        {project.headline && <p className="line-clamp-2 text-sm text-muted">{project.headline}</p>}

        {project.results.length > 0 && (
          <ResultList
            results={project.results.slice(0, 2)}
            className="grid grid-cols-2 gap-4 border-y border-border/70 py-3.5"
          />
        )}

        {project.stack.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-1" aria-label="Technologies">
            {project.stack.slice(0, CARD_STACK_LIMIT).map((tech) => (
              <li key={tech}>
                <Badge tone="outline">{tech}</Badge>
              </li>
            ))}
            {extraStack > 0 && (
              <li>
                <Badge tone="outline" aria-label={`and ${extraStack} more`}>+{extraStack}</Badge>
              </li>
            )}
          </ul>
        )}

        {/* Explicit touch affordance; the whole card is clickable via the title link */}
        <div className="mt-2 flex items-center border-t border-border/60 pt-3 text-xs font-medium">
          <span className="inline-flex items-center gap-1 text-foreground transition-colors group-hover:text-accent-text">
            Read case study
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </article>
  );
}

export function ProjectGrid({ projects, priorityCount = 0 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} priority={index < priorityCount} />
      ))}
    </div>
  );
}

export function StatStrip({ stats }) {
  if (!stats.length) return null;
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-4">
      {stats.slice(0, 4).map((stat) => (
        <div key={stat.id} className="flex flex-col-reverse gap-1 bg-background p-5 sm:p-6">
          <dt className="text-sm text-muted">{stat.label}</dt>
          <dd className="text-3xl font-semibold tracking-tight sm:text-4xl">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CtaBand() {
  return (
    <Section>
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-8 shadow-xs sm:p-12 lg:p-14">
        {/* Subtle ambient gradient flare in corner */}
        <div 
          className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-gradient-to-br from-accent/20 via-sky-500/10 to-transparent blur-3xl opacity-70" 
          aria-hidden="true" 
        />

        <div className="relative flex flex-col items-start gap-6 sm:gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-3">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent-text">
              Let&apos;s Connect
            </span>
            <h2 className="text-h2 font-semibold tracking-tight text-foreground">
              Have a product in mind?
            </h2>
            <p className="text-pretty text-base text-muted sm:text-lg">
              Tell me about your goals and let&apos;s work out the right way to build it.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-accent px-6 font-medium text-accent-foreground shadow-sm transition-all hover:bg-accent/90 hover:shadow-md focus-visible:ring-offset-2"
          >
            Start a conversation
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
