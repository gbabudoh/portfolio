'use client';

import { Code2 } from 'lucide-react';
import { ResourceManager } from '@/components/admin/resource-manager';
import { SKILL_CATEGORY_NAMES, SKILL_DOMAINS, findSkillCategory } from '@/lib/skill-taxonomy';

const CATEGORIES = SKILL_CATEGORY_NAMES;

// Shows which public domain (About page tab) each category appears under.
const DOMAIN_NAMES = Object.fromEntries(SKILL_DOMAINS.map((d) => [d.id, d.name]));
const GROUP_BY = {
  key: 'category',
  order: CATEGORIES,
  caption: (category) => {
    const match = findSkillCategory(category);
    return match ? `· ${DOMAIN_NAMES[match.domain]}` : '· Not in the category list';
  },
};

// Highest proficiency first, then in the order entries were added.
const byProficiency = (a, b) => (b.proficiency ?? 0) - (a.proficiency ?? 0) || a.id - b.id;

const LEVELS = [
  { value: '5', label: '5 — Expert' },
  { value: '4', label: '4 — Advanced' },
  { value: '3', label: '3 — Proficient' },
  { value: '2', label: '2 — Working knowledge' },
  { value: '1', label: '1 — Familiar' },
];

const FIELDS = [
  { name: 'name', type: 'text', label: 'Name', required: true },
  { name: 'category', type: 'select', label: 'Category', required: true, options: CATEGORIES, span: 1 },
  { name: 'proficiency', type: 'select', label: 'Proficiency', options: LEVELS, span: 1, hint: 'Orders skills within their category. Not shown publicly.' },
  { name: 'description', type: 'textarea', label: 'Description', rows: 3 },
];

function Level({ value }) {
  return (
    <span className="flex gap-0.5" aria-label={`Proficiency ${value} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= value ? 'h-1.5 w-3 rounded-full bg-accent' : 'h-1.5 w-3 rounded-full bg-border'} />
      ))}
    </span>
  );
}

export default function SkillsAdminPage() {
  return (
    <ResourceManager
      endpoint="/api/skills"
      title="Skills"
      description="Listed by category in display order. Use 'Label: item, item' in the name to show a labelled row of chips on the About page."
      singular="skill"
      emptyIcon={Code2}
      fields={FIELDS}
      defaults={{ name: '', category: '', proficiency: '4', description: '', icon: '' }}
      searchKeys={['name', 'category', 'description']}
      filter={{ key: 'category', label: 'Categories' }}
      groupBy={GROUP_BY}
      sort={byProficiency}
      toForm={(row) => ({ ...row, proficiency: String(row.proficiency ?? 3), icon: row.icon || '', description: row.description || '' })}
      toPayload={(v) => ({ ...v, proficiency: Number(v.proficiency) || 3 })}
      primary={(row) => ({ title: row.name, subtitle: row.description || undefined })}
      columns={[{ label: 'Level', className: 'w-24', render: (row) => <Level value={row.proficiency} /> }]}
    />
  );
}
