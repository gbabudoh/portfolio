/**
 * Moves existing projects onto the case-study model (src/lib/project-model.js).
 *
 * Usage: node scripts/migrate-projects.js
 *
 * Safe to run more than once — it only fills in what is missing:
 *   - adds the new columns if the app hasn't already
 *   - freezes each project's URL slug from its current title
 *   - splits the Overview text into "What I built" bullets (the Overview is kept)
 *   - converts the comma-separated stack to a JSON list
 *   - sets the display order to the current public order (featured first, newest first)
 * Problem, results and role are left for you to fill in from the admin.
 * A timestamped copy of the database is written next to it first, and all
 * changes run in one transaction. Run it before `npm run build`.
 */

import Database from 'better-sqlite3';
import path from 'path';
import { deriveBuiltFromOverview, missingProof, parseStringList, slugify } from '../src/lib/project-model.js';

const dbPath = process.env.DATABASE_URL
  ? path.isAbsolute(process.env.DATABASE_URL)
    ? process.env.DATABASE_URL
    : path.join(process.cwd(), process.env.DATABASE_URL)
  : path.join(process.cwd(), 'portfolio.db');

const NEW_COLUMNS = [
  'problem TEXT',
  'built TEXT',
  'results TEXT',
  'role TEXT',
  'case_study TEXT',
  'slug TEXT',
  "status TEXT NOT NULL DEFAULT 'published'",
  'display_order INTEGER NOT NULL DEFAULT 0',
];

const isJsonList = (value) => /^\s*\[/.test(String(value || ''));

async function migrateProjects() {
  const db = new Database(dbPath, { fileMustExist: true });
  try {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${dbPath}.backup-${stamp}`;
    await db.backup(backupPath);
    console.log(`✓ Backup written to ${backupPath}\n`);

    const existing = new Set(db.prepare('PRAGMA table_info(projects)').all().map((c) => c.name));
    for (const column of NEW_COLUMNS) {
      if (!existing.has(column.split(' ')[0])) db.exec(`ALTER TABLE projects ADD COLUMN ${column}`);
    }

    const rows = db.prepare('SELECT * FROM projects ORDER BY featured DESC, created_at DESC, id DESC').all();
    const setOrder = rows.every((r) => !r.display_order);
    const usedSlugs = new Set(rows.map((r) => r.slug).filter(Boolean));
    const update = db.prepare(
      'UPDATE projects SET slug = ?, built = ?, technologies = ?, display_order = ? WHERE id = ?'
    );

    db.transaction(() => {
      rows.forEach((row, index) => {
        let slug = row.slug;
        if (!slug) {
          const base = slugify(row.title) || `project-${row.id}`;
          slug = base;
          for (let n = 2; usedSlugs.has(slug); n++) slug = `${base}-${n}`;
          usedSlugs.add(slug);
        }

        const built = parseStringList(row.built).length
          ? row.built
          : JSON.stringify(deriveBuiltFromOverview(row.long_description));
        const technologies = isJsonList(row.technologies)
          ? row.technologies
          : JSON.stringify(parseStringList(row.technologies));
        const order = setOrder ? index + 1 : row.display_order;

        update.run(slug, built, technologies, order, row.id);

        const missing = missingProof({ ...row, built });
        console.log(`  ${String(order).padStart(2)}. ${row.title}`);
        console.log(`      /work/${slug} · ${parseStringList(built).length} built bullets · ${row.status || 'published'}`);
        if (missing.length) console.log(`      still to fill in: ${missing.join(', ')}`);
      });
    })();
    db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug) WHERE slug IS NOT NULL AND slug != ''");

    console.log(`\n✓ Migrated ${rows.length} projects${setOrder ? ' (display order set from the current order)' : ''}`);
  } catch (error) {
    console.error('Error migrating projects:', error);
    process.exitCode = 1;
  } finally {
    db.close();
  }
}

console.log('Projects Migration Script');
console.log('=========================\n');
console.log(`Database: ${dbPath}`);
migrateProjects();
