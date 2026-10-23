// Server-side writes for projects. Validation lives in project-model.js; this
// module resolves slugs, assigns display order and talks to the database.
import { getDatabase } from '@/lib/database';
import { slugify, validateProject } from '@/lib/project-model';

const COLUMNS = [
  'title', 'slug', 'category', 'status', 'featured', 'description', 'problem', 'role', 'built', 'results',
  'technologies', 'long_description', 'image_url', 'image_public_id', 'live_url', 'github_url',
];

export function listProjects({ includeDrafts }) {
  const where = includeDrafts ? '' : "WHERE status = 'published'";
  return getDatabase().prepare(`SELECT * FROM projects ${where} ORDER BY display_order ASC, id ASC`).all();
}

function slugTaken(db, slug, exceptId) {
  return Boolean(db.prepare('SELECT 1 FROM projects WHERE slug = ? AND id != ?').get(slug, exceptId ?? -1));
}

// An explicit slug must be free; an empty one is generated from the title and
// made unique, then stored so the URL no longer changes when the title does.
function resolveSlug(db, data, exceptId) {
  if (data.slug) {
    return slugTaken(db, data.slug, exceptId) ? { error: 'Another project already uses this URL' } : { slug: data.slug };
  }
  const base = slugify(data.title) || 'project';
  let slug = base;
  for (let n = 2; slugTaken(db, slug, exceptId); n++) slug = `${base}-${n}`;
  return { slug };
}

// Returns { id } on success or { errors } keyed by field.
export function saveProject(input, id = null) {
  const { data, errors } = validateProject(input);
  if (errors) return { errors };

  const db = getDatabase();
  const slug = resolveSlug(db, data, id);
  if (slug.error) return { errors: { slug: slug.error } };
  data.slug = slug.slug;

  const values = COLUMNS.map((c) => data[c]);
  if (id === null) {
    const { next } = db.prepare('SELECT COALESCE(MAX(display_order), 0) + 1 AS next FROM projects').get();
    const result = db
      .prepare(`INSERT INTO projects (${COLUMNS.join(', ')}, display_order) VALUES (${COLUMNS.map(() => '?').join(', ')}, ?)`)
      .run(...values, next);
    return { id: result.lastInsertRowid };
  }

  const result = db
    .prepare(`UPDATE projects SET ${COLUMNS.map((c) => `${c} = ?`).join(', ')} WHERE id = ?`)
    .run(...values, id);
  return result.changes > 0 ? { id } : { notFound: true };
}

// ids: every project id in the new display order.
export function reorderProjects(ids) {
  const db = getDatabase();
  const update = db.prepare('UPDATE projects SET display_order = ? WHERE id = ?');
  db.transaction(() => ids.forEach((id, index) => update.run(index + 1, id)))();
}
