// Project case-study model: field limits, parsing of the JSON list columns, and
// the rules a project must meet before it can be published. Shared by the API,
// the public read model and scripts/migrate-projects.js, so it has no imports.

export const PROJECT_LIMITS = {
  title: 120,
  headline: 120,
  problem: 300,
  role: 80,
  builtItem: 160,
  builtMax: 5,
  resultValue: 10,
  resultLabel: 40,
  resultsMax: 4,
  stackItem: 40,
  stackMax: 20,
};

export const PROJECT_STATUSES = ['draft', 'published'];
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Splits on commas that aren't inside parentheses: "Stripe (Checkout, Connect), Prisma".
function splitTopLevel(text) {
  return String(text)
    .split(/,(?![^(]*\))/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// JSON array column -> string[]. Also accepts legacy comma-separated text.
export function parseStringList(value) {
  if (Array.isArray(value)) return value.map((s) => String(s).trim()).filter(Boolean);
  if (!value) return [];
  const text = String(value).trim();
  if (text.startsWith('[')) {
    try {
      return parseStringList(JSON.parse(text));
    } catch {
      // Fall through and treat it as plain text.
    }
  }
  return splitTopLevel(text);
}

// JSON column -> [{ value, label }], dropping incomplete pairs.
export function parseResults(value) {
  let list = value;
  if (typeof value === 'string') {
    try {
      list = JSON.parse(value || '[]');
    } catch {
      list = [];
    }
  }
  if (!Array.isArray(list)) return [];
  return list
    .map((r) => ({ value: String(r?.value ?? '').trim(), label: String(r?.label ?? '').trim() }))
    .filter((r) => r.value && r.label);
}

// Turns the legacy Overview text into draft "What I built" bullets: the
// "Key Features:" list or bullet lines if present, otherwise one per sentence.
export function deriveBuiltFromOverview(overview, max = PROJECT_LIMITS.builtMax) {
  const paragraphs = String(overview || '')
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const bullets = [];
  const plain = [];
  for (const p of paragraphs) {
    if (/Key Features:/i.test(p)) {
      p.split(/Key Features:/i)[1]
        .split(/\r?\n|•|\*/)
        .map((s) => s.replace(/^[-–]\s*/, '').trim())
        .filter((s) => s && !/^Tech Stack:/i.test(s))
        .forEach((s) => bullets.push(s));
    } else if (/^[•\-*]/.test(p)) {
      p.split(/\r?\n/)
        .map((s) => s.replace(/^[•\-*]\s*/, '').trim())
        .filter(Boolean)
        .forEach((s) => bullets.push(s));
    } else if (!/^Tech Stack:/i.test(p)) {
      p.split(/(?<=[.!?])\s+(?=[A-Z])/)
        .map((s) => s.trim().replace(/\.$/, ''))
        .filter(Boolean)
        .forEach((s) => plain.push(s));
    }
  }
  return (bullets.length ? bullets : plain).slice(0, max);
}

/**
 * Validates and normalises an admin payload.
 * Returns { data } ready to store, or { errors } keyed by form field name.
 * Proof (headline, problem, at least one result) is only required to publish.
 */
export function validateProject(input) {
  const L = PROJECT_LIMITS;
  const errors = {};
  const text = (key) => String(input[key] ?? '').trim();

  const data = {
    title: text('title'),
    slug: text('slug').toLowerCase(),
    category: text('category'),
    status: PROJECT_STATUSES.includes(input.status) ? input.status : 'draft',
    featured: input.featured ? 1 : 0,
    description: text('description'),
    problem: text('problem'),
    role: text('role'),
    long_description: text('long_description'),
    image_url: text('image_url'),
    image_public_id: text('image_public_id'),
    live_url: text('live_url'),
    github_url: text('github_url'),
    built: parseStringList(input.built),
    results: Array.isArray(input.results)
      ? input.results.map((r) => ({ value: String(r?.value ?? '').trim(), label: String(r?.label ?? '').trim() }))
      : parseResults(input.results),
    technologies: parseStringList(input.technologies),
  };

  if (!data.title) errors.title = 'Title is required';
  else if (data.title.length > L.title) errors.title = `Keep the title under ${L.title} characters`;
  if (!data.category) errors.category = 'Category is required';
  if (data.slug && !SLUG_PATTERN.test(data.slug)) {
    errors.slug = 'Use lowercase letters, numbers and single hyphens, e.g. ese-lounge';
  }

  for (const [key, max] of [['description', L.headline], ['problem', L.problem], ['role', L.role]]) {
    if (data[key].length > max) errors[key] = `Keep this under ${max} characters`;
  }
  for (const key of ['live_url', 'github_url']) {
    if (data[key] && !/^https?:\/\//i.test(data[key])) errors[key] = 'Must start with http:// or https://';
  }

  if (data.built.length > L.builtMax) errors.built = `Use at most ${L.builtMax} items`;
  else if (data.built.some((b) => b.length > L.builtItem)) errors.built = `Keep each item under ${L.builtItem} characters`;

  data.results = data.results.filter((r) => r.value || r.label);
  if (data.results.some((r) => !r.value || !r.label)) errors.results = 'Each result needs both a value and a label';
  else if (data.results.length > L.resultsMax) errors.results = `Use at most ${L.resultsMax} results`;
  else if (data.results.some((r) => r.value.length > L.resultValue)) {
    errors.results = `Keep values short (${L.resultValue} characters max), e.g. 95+ or £0/mo`;
  } else if (data.results.some((r) => r.label.length > L.resultLabel)) {
    errors.results = `Keep labels under ${L.resultLabel} characters`;
  }

  if (data.technologies.length > L.stackMax) errors.technologies = `Use at most ${L.stackMax} technologies`;
  else if (data.technologies.some((t) => t.length > L.stackItem)) errors.technologies = 'One of the technologies is too long';

  if (data.status === 'published') {
    const proof = 'Required to publish — save as a draft until it’s ready';
    if (!data.description) errors.description = errors.description || proof;
    if (!data.problem) errors.problem = errors.problem || proof;
    if (data.results.length === 0) errors.results = errors.results || 'Add at least one result to publish';
  }

  if (Object.keys(errors).length) return { errors };
  return {
    data: {
      ...data,
      built: JSON.stringify(data.built),
      results: JSON.stringify(data.results),
      technologies: JSON.stringify(data.technologies),
    },
  };
}

// Admin list badge: what a published project is still missing.
export function missingProof(row) {
  const missing = [];
  if (!String(row.description || '').trim()) missing.push('headline');
  if (!String(row.problem || '').trim()) missing.push('problem');
  if (parseResults(row.results).length === 0) missing.push('results');
  return missing;
}
