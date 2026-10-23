// Skill taxonomy shared by the admin and the public About page, so both always
// agree on category order and grouping. Pure data — safe to import anywhere.

// Public domains, in display order. Each category below belongs to exactly one.
export const SKILL_DOMAINS = [
  { id: 'product-engineering', name: 'Product Engineering' },
  { id: 'backend-data', name: 'Backend & Data' },
  { id: 'infrastructure-security', name: 'Infrastructure & Security' },
  { id: 'ai-engineering', name: 'AI Engineering' },
  { id: 'delivery', name: 'Delivery' },
];

// Categories in display order. `name` is the value stored in the database (and
// offered in the admin); `label` is an optional shorter heading for the site.
export const SKILL_CATEGORIES = [
  { name: 'Frontend', domain: 'product-engineering' },
  { name: 'Styling', domain: 'product-engineering' },
  { name: 'Languages', domain: 'product-engineering' },
  { name: 'Backend', domain: 'backend-data' },
  { name: 'Database', domain: 'backend-data' },
  { name: 'APIs & Communication', domain: 'backend-data' },
  { name: 'Infrastructure (DevOps)', label: 'Infrastructure', domain: 'infrastructure-security' },
  { name: 'Security', domain: 'infrastructure-security' },
  { name: 'AI & LLM Engineering', domain: 'ai-engineering' },
  { name: 'Development Environment & AI Workflow', label: 'Dev Environment & AI Workflow', domain: 'ai-engineering' },
  { name: 'Performance & SEO Optimization', label: 'Performance & SEO', domain: 'delivery' },
  { name: 'Specialised', domain: 'delivery' },
  { name: 'Version Control & Collaboration', label: 'Version Control', domain: 'infrastructure-security' },
  // Not used by the current skill set; kept so entries added later still have a home.
  { name: 'Ideation & Design', domain: 'product-engineering' },
  { name: 'Mobile', domain: 'product-engineering' },
  { name: 'Testing (QA)', domain: 'delivery' },
];

export const SKILL_CATEGORY_NAMES = SKILL_CATEGORIES.map((c) => c.name);

// Older spellings still found in some databases.
const ALIASES = {
  Specialized: 'Specialised',
  'Performance & SEO': 'Performance & SEO Optimization',
};

export function normaliseSkillCategory(category) {
  return ALIASES[category] || category;
}

export function findSkillCategory(category) {
  const name = normaliseSkillCategory(category);
  return SKILL_CATEGORIES.find((c) => c.name === name) || null;
}
