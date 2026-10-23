// Server-side read model for the public site. Pages call these directly
// (React Server Components) instead of fetching our own API over HTTP.
import { getDatabase } from '@/lib/database';
import { parseResults, parseStringList, slugify } from '@/lib/project-model';
import { SKILL_CATEGORIES, SKILL_DOMAINS, normaliseSkillCategory } from '@/lib/skill-taxonomy';

export { formatMonth } from '@/lib/format';
export { slugify };

export function splitList(value) {
  if (!value) return [];
  return String(value)
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toProject(row) {
  const built = parseStringList(row.built);
  return {
    id: row.id,
    slug: row.slug || slugify(row.title) || String(row.id),
    title: row.title,
    headline: row.description || '',
    problem: row.problem || '',
    built,
    // Legacy Overview paragraphs, only used while "What I built" is still empty.
    overview: built.length
      ? []
      : String(row.long_description || '')
          .split(/\r?\n\s*\r?\n/)
          .map((p) => p.trim())
          .filter(Boolean),
    results: parseResults(row.results),
    caseStudy: row.case_study || '',
    role: row.role || '',
    image: row.image_url || null,
    liveUrl: row.live_url || null,
    repoUrl: row.github_url || null,
    category: row.category,
    featured: Boolean(row.featured),
    stack: parseStringList(row.technologies),
    createdAt: row.created_at,
  };
}

// Published projects in the order set in the admin.
export function getProjects() {
  const rows = getDatabase()
    .prepare("SELECT * FROM projects WHERE status = 'published' ORDER BY display_order ASC, id ASC")
    .all();
  return rows.map(toProject);
}

// Featured projects first (in admin order), topped up with the rest if there are too few.
export function getFeaturedProjects(limit = 3) {
  const projects = getProjects();
  return [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)].slice(0, limit);
}

export function getProjectBySlug(slug) {
  return getProjects().find((p) => p.slug === slug) || null;
}

export function getAdjacentProject(slug) {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1 || projects.length < 2) return null;
  return projects[(index + 1) % projects.length];
}

export function getStats() {
  const db = getDatabase();
  const stats = db.prepare('SELECT * FROM stats ORDER BY display_order ASC, id ASC').all();
  const projectCount = db.prepare('SELECT COUNT(*) AS n FROM projects').get().n;
  // "production_projects" is derived from the projects table so it never goes stale.
  return stats.map((s) => ({
    id: s.id,
    key: s.key,
    label: s.label,
    value: s.key === 'production_projects' && projectCount > 0 ? `${projectCount}+` : s.value,
  }));
}

export function getAbout() {
  const rows = getDatabase().prepare('SELECT section, title, content FROM about_content').all();
  return Object.fromEntries(rows.map((r) => [r.section, r]));
}

export function getExperience() {
  const rows = getDatabase()
    .prepare('SELECT * FROM experience ORDER BY current DESC, start_date DESC, id ASC')
    .all();
  return rows.map((row) => ({
    id: row.id,
    company: row.company,
    role: row.position,
    summary: row.description,
    start: row.start_date,
    end: row.end_date,
    current: Boolean(row.current),
    stack: splitList(row.technologies),
    highlights: String(row.achievements || '')
      .split('\n')
      .map((s) => s.replace(/^[-•*]\s*/, '').trim())
      .filter(Boolean),
  }));
}

// Domain -> category -> entries, in the order defined by the shared taxonomy.
// Categories not in the taxonomy are collected under "Other" so nothing disappears.
export function getSkillGroups() {
  const skills = getDatabase()
    .prepare('SELECT name, category FROM skills ORDER BY proficiency DESC, id ASC')
    .all();

  const byCategory = new Map();
  for (const skill of skills) {
    const category = normaliseSkillCategory(skill.category);
    if (!byCategory.has(category)) byCategory.set(category, []);
    byCategory.get(category).push(parseSkillEntry(skill.name));
  }

  const toCategory = (name, label) => {
    const entries = byCategory.get(name);
    byCategory.delete(name);
    return { id: slugify(name), name: label || name, entries };
  };

  const domains = SKILL_DOMAINS.map((domain) => ({
    id: domain.id,
    name: domain.name,
    categories: SKILL_CATEGORIES.filter((c) => c.domain === domain.id && byCategory.has(c.name)).map((c) =>
      toCategory(c.name, c.label)
    ),
  }));
  domains.push({ id: 'other', name: 'Other', categories: [...byCategory.keys()].map((name) => toCategory(name)) });

  return domains
    .filter((d) => d.categories.length > 0)
    .map((d) => ({
      ...d,
      count: d.categories.reduce((n, c) => n + c.entries.reduce((m, e) => m + e.items.length, 0), 0),
    }));
}

// "Frameworks: Express, Django (Python), .NET (C#)" -> { label, items[] }.
// Splits on commas or semicolons that aren't inside parentheses and drops trailing full stops.
function parseSkillEntry(text) {
  const split = text.indexOf(':');
  const label = split > 0 ? text.slice(0, split).trim() : null;
  const rest = split > 0 ? text.slice(split + 1) : text;
  const items = rest
    .split(/[,;](?![^(]*\))/)
    .map((item) => item.trim().replace(/\.$/, ''))
    .filter(Boolean);
  return { label, items };
}
