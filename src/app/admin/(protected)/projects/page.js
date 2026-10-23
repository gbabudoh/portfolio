'use client';

import { Briefcase, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ResourceManager } from '@/components/admin/resource-manager';
import { PROJECT_LIMITS as L, missingProof, parseResults, parseStringList } from '@/lib/project-model';

const CATEGORIES = [
  'Marketing & Content Platforms',
  'SaaS & Productivity',
  'Commerce & Marketplaces',
  'AI & Data Intelligence',
  'Interactive & Media',
  'Mobile Applications',
  'Design & Strategy Case Studies',
];

const STATUSES = [
  { value: 'draft', label: 'Draft — hidden from the site' },
  { value: 'published', label: 'Published' },
];

// Proof is only required to publish; drafts can be saved incomplete.
const toPublish = (values) => values.status === 'published';

const FIELDS = [
  { name: 'basics', type: 'section', label: 'Basics' },
  { name: 'cover', type: 'image', label: 'Cover image', urlKey: 'image_url', idKey: 'image_public_id', folder: 'portfolio/projects' },
  { name: 'title', type: 'text', label: 'Title', required: true, maxLength: L.title },
  { name: 'category', type: 'select', label: 'Category', required: true, options: CATEGORIES, span: 1 },
  { name: 'status', type: 'select', label: 'Status', required: true, options: STATUSES, span: 1 },
  {
    name: 'slug',
    type: 'text',
    label: 'URL slug',
    placeholder: 'generated from the title',
    hint: 'The page address: /work/your-slug. Leave empty to generate it. Changing it later breaks existing links.',
    span: 1,
  },
  { name: 'featured', type: 'switch', label: 'Featured', hint: 'Featured projects lead the home page.', span: 1 },

  { name: 'case-study', type: 'section', label: 'Case study', hint: 'Headline, problem and at least one result are required to publish.' },
  {
    name: 'description',
    type: 'text',
    label: 'Headline',
    required: toPublish,
    requiredMessage: 'A headline is required to publish',
    maxLength: L.headline,
    placeholder: 'Booking platform that cut no-shows by 40%',
    hint: 'One line on project cards and under the title.',
  },
  {
    name: 'problem',
    type: 'textarea',
    label: 'The problem',
    rows: 3,
    required: toPublish,
    requiredMessage: 'The problem is required to publish',
    maxLength: L.problem,
    hint: 'What the client was struggling with, in two or three sentences.',
  },
  {
    name: 'results',
    type: 'pairs',
    label: 'Results',
    required: toPublish,
    requiredMessage: 'Add at least one result to publish',
    maxItems: L.resultsMax,
    addLabel: 'Add result',
    keys: [
      { name: 'value', label: 'Value', placeholder: '95+', maxLength: L.resultValue, className: 'w-28 shrink-0 sm:w-32' },
      { name: 'label', label: 'Label', placeholder: 'Lighthouse score', maxLength: L.resultLabel },
    ],
    hint: `Up to ${L.resultsMax}. The first two appear on the project card as big numbers.`,
  },
  {
    name: 'built',
    type: 'list',
    label: 'What I built',
    maxItems: L.builtMax,
    itemMaxLength: L.builtItem,
    addLabel: 'Add bullet',
    placeholder: 'Multi-vendor checkout with Stripe Connect payouts',
    hint: `3–${L.builtMax} short bullets.`,
  },
  {
    name: 'case_study',
    type: 'markdown',
    label: 'How it was built (optional)',
    maxLength: L.caseStudy,
    placeholder: '### Key decisions\n\n**SQLite over a hosted database.** …\n\n### Challenges\n\n…\n\n### Outcome\n\n…',
    hint: 'Markdown. Shown after “What I built”. Aim for 3 short sections (e.g. Key decisions, Challenges, Outcome), 250–400 words.',
  },
  { name: 'role', type: 'text', label: 'My role', maxLength: L.role, placeholder: 'Sole engineer — design, build and deployment' },
  {
    name: 'technologies',
    type: 'tags',
    label: 'Stack',
    maxItems: L.stackMax,
    placeholder: 'Type a technology and press Enter',
    hint: 'Cards show the first 4, then “+N”.',
  },

  { name: 'links', type: 'section', label: 'Links' },
  { name: 'live_url', type: 'url', label: 'Live URL', placeholder: 'https://', span: 1 },
  { name: 'github_url', type: 'url', label: 'GitHub URL', placeholder: 'https://', span: 1 },

  // Only shown for projects that still have the old free-text overview.
  {
    name: 'legacy',
    type: 'section',
    label: 'Legacy overview',
    hint: 'Not shown on the site while “What I built” has items. Kept as a fallback and for reference.',
    showIf: (v) => Boolean(v.long_description),
  },
  { name: 'long_description', type: 'textarea', label: 'Overview', rows: 6, showIf: (v) => Boolean(v.long_description) },
];

const DEFAULTS = {
  title: '', slug: '', category: '', status: 'draft', featured: false,
  description: '', problem: '', results: [], built: [], case_study: '', role: '', technologies: [],
  live_url: '', github_url: '', image_url: '', image_public_id: '', long_description: '',
};

function StatusBadges({ row }) {
  if (row.status !== 'published') return <Badge>Draft</Badge>;
  const missing = missingProof(row);
  return (
    <>
      {row.featured ? <Badge tone="accent">Featured</Badge> : null}
      {missing.length > 0 && (
        <Badge tone="warning" title={`Missing: ${missing.join(', ')}`}>
          Needs proof
        </Badge>
      )}
    </>
  );
}

export default function ProjectsAdminPage() {
  return (
    <ResourceManager
      endpoint="/api/projects"
      title="Projects"
      description="Case studies shown on the Work page, in this order. Use the arrows to reorder."
      singular="project"
      emptyIcon={Briefcase}
      sheetSize="lg"
      fields={FIELDS}
      defaults={DEFAULTS}
      reorder={{ endpoint: '/api/projects/reorder' }}
      searchKeys={['title', 'description', 'technologies', 'category']}
      filter={{ key: 'category', label: 'Categories' }}
      toForm={(row) => ({
        ...row,
        slug: row.slug || '',
        status: row.status || 'published',
        featured: Boolean(row.featured),
        description: row.description || '',
        problem: row.problem || '',
        role: row.role || '',
        case_study: row.case_study || '',
        long_description: row.long_description || '',
        results: parseResults(row.results),
        built: parseStringList(row.built),
        technologies: parseStringList(row.technologies),
      })}
      toPayload={(v) => ({
        ...v,
        built: v.built.map((b) => b.trim()).filter(Boolean),
        results: v.results.filter((r) => String(r.value ?? '').trim() || String(r.label ?? '').trim()),
      })}
      primary={(row) => ({
        title: row.title,
        subtitle: row.description,
        media: row.image_url || null,
        badge: <StatusBadges row={row} />,
      })}
      columns={[
        { label: 'Category', className: 'w-56 truncate text-xs', render: (row) => row.category },
        {
          label: 'Live',
          className: 'w-8',
          render: (row) =>
            row.live_url ? (
              <a
                href={row.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="grid size-8 place-items-center rounded-md hover:bg-subtle hover:text-foreground"
                aria-label={`Open ${row.title} live site`}
              >
                <ExternalLink className="size-4" />
              </a>
            ) : null,
        },
      ]}
    />
  );
}
