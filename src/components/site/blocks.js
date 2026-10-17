import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ImageOff } from 'lucide-react';
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

export function ProjectCard({ project, priority = false }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-background shadow-xs transition-all duration-300 hover:border-foreground/30 hover:shadow-md">
      {/* Mini browser mock header */}
      <div className="flex items-center gap-1.5 border-b border-border/60 bg-subtle/70 px-3.5 py-2">
        <span className="size-1.5 rounded-full bg-border" />
        <span className="size-1.5 rounded-full bg-border" />
        <span className="size-1.5 rounded-full bg-border" />
        <span className="ml-1.5 truncate font-mono text-[10px] text-muted">
          {project.slug}.app
        </span>
      </div>

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
        <p className="line-clamp-2 text-sm text-muted">{project.summary}</p>
        {project.stack.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-2" aria-label="Technologies">
            {project.stack.slice(0, 3).map((tech) => (
              <li key={tech}>
                <Badge tone="outline">{tech}</Badge>
              </li>
            ))}
            {project.stack.length > 3 && (
              <li>
                <Badge tone="outline">+{project.stack.length - 3}</Badge>
              </li>
            )}
          </ul>
        )}

        {/* Mobile-first explicit touch link affordance */}
        <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-xs font-medium">
          <span className="inline-flex items-center gap-1 text-foreground transition-colors group-hover:text-accent-text">
            Read case study
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </span>
          <span className="font-mono text-[11px] text-muted">Production</span>
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
