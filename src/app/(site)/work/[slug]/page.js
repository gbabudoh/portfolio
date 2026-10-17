import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, Github, Sparkles } from 'lucide-react';
import { getAdjacentProject, getProjectBySlug, getProjects } from '@/lib/content';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { CtaBand, ProjectImage } from '@/components/site/blocks';

export const revalidate = 3600;

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.summary,
      images: project.image ? [{ url: project.image }] : undefined,
    },
  };
}

function MetaRow({ label, children }) {
  return (
    <div className="space-y-1.5 border-t border-border py-4 first:border-t-0 first:pt-0">
      <dt className="eyebrow">{label}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  );
}

function parseCaseStudy(rawText, summary) {
  const content = rawText || summary || '';
  const rawParagraphs = content.split(/\r?\n\s*\r?\n/).filter(Boolean);

  const narrative = [];
  const keyFeatures = [];

  for (const p of rawParagraphs) {
    if (/Key Features:/i.test(p)) {
      const parts = p.split(/Key Features:/i);
      if (parts[0].trim()) narrative.push(parts[0].trim());

      const featureLines = parts[1]
        .split(/\r?\n|•|\*/)
        .map((s) => s.trim())
        .filter(Boolean);

      for (const line of featureLines) {
        if (/^Tech Stack:/i.test(line)) continue;
        if (line.includes(',') && !line.includes('(')) {
          line
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
            .forEach((f) => keyFeatures.push(f));
        } else {
          keyFeatures.push(line);
        }
      }
    } else if (p.trim().startsWith('•') || p.trim().startsWith('-')) {
      const lines = p
        .split(/\r?\n/)
        .map((s) => s.replace(/^[•\-\*]\s*/, '').trim())
        .filter(Boolean);
      keyFeatures.push(...lines);
    } else if (/^Tech Stack:/i.test(p.trim())) {
      // Redundant with the stack badge list; safely skip.
      continue;
    } else {
      narrative.push(p.trim());
    }
  }

  return { narrative, keyFeatures };
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const next = getAdjacentProject(slug);
  const { narrative, keyFeatures } = parseCaseStudy(project.body, project.summary);

  return (
    <article>
      {/* Header */}
      <header className="container pb-6 pt-6 sm:pb-10 sm:pt-14">
        <Link
          href="/work"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground sm:mb-8"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          All work
        </Link>

        <div className="max-w-3xl animate-fade-up space-y-4 sm:space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{project.category}</Badge>
            {project.featured && <Badge tone="accent">Featured</Badge>}
          </div>
          <h1 className="text-h1">{project.title}</h1>
          <p className="text-pretty text-base text-muted sm:text-lg lg:text-xl">{project.summary}</p>
          {(project.liveUrl || project.repoUrl) && (
            <div className="flex flex-wrap gap-3 pt-1 sm:pt-2">
              {project.liveUrl && (
                <ButtonLink href={project.liveUrl} external>
                  Visit live site
                  <ArrowUpRight />
                </ButtonLink>
              )}
              {project.repoUrl && (
                <ButtonLink href={project.repoUrl} external variant="secondary">
                  <Github />
                  Source code
                </ButtonLink>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Project Mockup / Screenshot */}
      <div className="container mt-2 sm:mt-6">
        <div className="overflow-hidden rounded-xl border border-border bg-subtle shadow-xs">
          <div className="flex items-center justify-between border-b border-border/70 bg-surface/90 px-3.5 py-2 text-xs text-muted sm:px-4 sm:py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-border" />
              <span className="size-2 rounded-full bg-border" />
              <span className="size-2 rounded-full bg-border" />
            </div>
            <span className="font-mono text-[11px] text-muted">
              {project.liveUrl ? project.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') : `${project.slug}.app`}
            </span>
            <div className="w-8" aria-hidden="true" />
          </div>

          <ProjectImage
            src={project.image}
            alt={`${project.title} screenshot`}
            priority
            sizes="(min-width: 1200px) 1136px, 100vw"
            className="aspect-[16/9] w-full"
          />
        </div>
      </div>

      {/* Mobile-first quick specs bar (visible on mobile screens, hidden on desktop where sidebar appears) */}
      <div className="container mt-6 lg:hidden">
        <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-muted uppercase tracking-wider text-[11px]">Category</span>
            <span className="font-medium text-foreground">{project.category}</span>
          </div>

          {project.stack.length > 0 && (
            <div className="border-t border-border/60 pt-2.5">
              <span className="mb-2 block font-mono text-[10px] uppercase tracking-wider text-muted">
                Technologies
              </span>
              <ul className="flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <li key={tech}>
                    <Badge tone="outline" className="text-[11px] px-2 py-0">
                      {tech}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Main Body & Sidebar Grid */}
      <div className="container grid gap-10 py-10 sm:py-16 lg:grid-cols-[1fr_280px] lg:gap-16">
        <div className="max-w-prose space-y-6">
          <h2 className="text-h2">Overview</h2>

          {narrative.map((text, i) => (
            <p key={i} className="text-pretty leading-relaxed text-muted sm:text-lg">
              {text}
            </p>
          ))}

          {/* Key Features Block */}
          {keyFeatures.length > 0 && (
            <div className="mt-8 space-y-4 rounded-xl border border-border/80 bg-surface/60 p-5 sm:p-6">
              <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Sparkles className="size-4 text-accent" />
                Key Features & Highlights
              </h3>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {keyFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Engineering Practices */}
          {project.practices.length > 0 && (
            <div className="space-y-4 pt-6">
              <h2 className="text-h2">Engineering practices</h2>
              <ul className="space-y-2">
                {project.practices.map((item) => (
                  <li key={item} className="flex gap-3 text-muted">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Bottom Conversion / Live Demo Callout */}
          {project.liveUrl && (
            <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-subtle/50 p-5 sm:flex-row sm:items-center sm:p-6">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground sm:text-base">
                  Experience {project.title} live
                </h3>
                <p className="text-xs text-muted sm:text-sm">
                  Test the responsive user interface and features directly in production.
                </p>
              </div>
              <ButtonLink href={project.liveUrl} external size="md" className="w-full shrink-0 sm:w-auto">
                Visit live site
                <ArrowUpRight className="size-4" />
              </ButtonLink>
            </div>
          )}
        </div>

        {/* Desktop Sticky Sidebar (hidden on mobile since mobile specs card appears above) */}
        <aside aria-label="Project details" className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
          <dl className="rounded-xl border border-border bg-surface p-5">
            <MetaRow label="Category">{project.category}</MetaRow>
            {project.stack.length > 0 && (
              <MetaRow label="Stack">
                <ul className="flex flex-wrap gap-1.5 pt-1">
                  {project.stack.map((tech) => (
                    <li key={tech}>
                      <Badge tone="outline">{tech}</Badge>
                    </li>
                  ))}
                </ul>
              </MetaRow>
            )}
            {project.liveUrl && (
              <MetaRow label="Live">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="link break-all">
                  {project.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
              </MetaRow>
            )}
          </dl>
        </aside>
      </div>

      {/* Next Project Footer */}
      {next && (
        <div className="border-t border-border">
          <Link
            href={`/work/${next.slug}`}
            className="group container flex items-center justify-between gap-6 py-8 sm:py-12"
          >
            <span className="space-y-1">
              <span className="eyebrow block">Next project</span>
              <span className="block text-h2 transition-colors group-hover:text-accent-text">{next.title}</span>
            </span>
            <ArrowRight
              className="size-6 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-foreground"
              aria-hidden="true"
            />
          </Link>
        </div>
      )}

      <CtaBand />
    </article>
  );
}
