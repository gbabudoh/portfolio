import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from 'lucide-react';
import { getAdjacentProject, getProjectBySlug, getProjects } from '@/lib/content';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { ProjectImage, ResultList } from '@/components/site/blocks';

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
    description: project.headline,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.headline,
      images: project.image ? [{ url: project.image }] : undefined,
    },
  };
}

// One case-study section: label on the left at desktop widths, content on the right.
function CaseSection({ id, title, children }) {
  return (
    <section aria-labelledby={id} className="grid gap-4 border-t border-border py-8 sm:py-10 lg:grid-cols-[220px_1fr] lg:gap-12">
      <h2 id={id} className="text-lg font-semibold tracking-tight">
        {title}
      </h2>
      <div className="min-w-0 max-w-prose">{children}</div>
    </section>
  );
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const next = getAdjacentProject(slug);
  const results = project.results.slice(0, 4);

  return (
    <article>
      {/* 1. Title, headline and links */}
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
          {project.headline && <p className="text-pretty text-base text-muted sm:text-lg lg:text-xl">{project.headline}</p>}
          {(project.liveUrl || project.repoUrl) && (
            <div className="flex flex-wrap gap-3 pt-1 sm:pt-2">
              {project.liveUrl && (
                <ButtonLink href={project.liveUrl} external>
                  Live site
                  <ArrowUpRight />
                </ButtonLink>
              )}
              {project.repoUrl && (
                <ButtonLink href={project.repoUrl} external variant="secondary">
                  <Github />
                  GitHub
                </ButtonLink>
              )}
            </div>
          )}
        </div>
      </header>

      {/* 2. Hero image */}
      <div className="container mt-2 sm:mt-6">
        <div className="overflow-hidden rounded-xl border border-border bg-subtle shadow-xs">
          <ProjectImage
            src={project.image}
            alt={`${project.title} screenshot`}
            priority
            sizes="(min-width: 1200px) 1136px, 100vw"
            className="aspect-[16/9] w-full"
          />
        </div>
      </div>

      {/* 3. Results strip — the first thing a buyer sees after the image */}
      {results.length > 0 && (
        <div className="container mt-8 sm:mt-12">
          <h2 className="sr-only">Results</h2>
          <ResultList
            results={results}
            size="lg"
            className={`grid grid-cols-2 gap-x-6 gap-y-8 rounded-xl border border-border bg-surface px-6 py-7 sm:px-8 ${
              results.length >= 3 ? 'lg:grid-cols-4' : ''
            } ${results.length === 3 ? 'sm:grid-cols-3' : ''}`}
          />
        </div>
      )}

      <div className="container py-10 sm:py-16">
        {/* 4. The problem */}
        {project.problem && (
          <CaseSection id="problem" title="The problem">
            <p className="text-pretty leading-relaxed text-muted sm:text-lg">{project.problem}</p>
          </CaseSection>
        )}

        {/* 5. What I built (falls back to the legacy overview until bullets are added) */}
        {project.built.length > 0 ? (
          <CaseSection id="built" title="What I built">
            <ul className="space-y-3">
              {project.built.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-muted sm:text-lg">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-foreground sm:mt-3" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </CaseSection>
        ) : (
          project.overview.length > 0 && (
            <CaseSection id="built" title="Overview">
              <div className="space-y-4">
                {project.overview.map((text, i) => (
                  <p key={i} className="text-pretty leading-relaxed text-muted sm:text-lg">
                    {text}
                  </p>
                ))}
              </div>
            </CaseSection>
          )
        )}

        {/* 6. My role */}
        {project.role && (
          <CaseSection id="role" title="My role">
            <p className="leading-relaxed text-muted sm:text-lg">{project.role}</p>
          </CaseSection>
        )}

        {/* 7. Stack */}
        {project.stack.length > 0 && (
          <CaseSection id="stack" title="Stack">
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li key={tech}>
                  <Badge tone="outline" className="px-2.5 py-1 text-sm">
                    {tech}
                  </Badge>
                </li>
              ))}
            </ul>
          </CaseSection>
        )}

        {/* 8. Call to action */}
        <div className="mt-6 flex flex-col items-start justify-between gap-5 rounded-xl border border-border bg-surface p-6 sm:mt-10 sm:flex-row sm:items-center sm:p-8">
          <div className="space-y-1">
            <p className="text-lg font-semibold tracking-tight sm:text-xl">Need something like this?</p>
            <p className="text-sm text-muted sm:text-base">Tell me what you’re building and I’ll show you how I’d approach it.</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-foreground/85 sm:w-auto"
          >
            Let’s talk
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Next project */}
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
    </article>
  );
}
