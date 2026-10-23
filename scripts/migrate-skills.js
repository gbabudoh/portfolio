/**
 * Loads the canonical skill set (src/lib/skill-seed.js) into the database.
 *
 * Usage: node scripts/migrate-skills.js [--clear]
 *   --clear: Replace all existing skills instead of appending to them
 *
 * A timestamped copy of the database is written next to it before any change,
 * and the delete + insert run in one transaction, so a failure changes nothing.
 * Run it before `npm run build` so the rebuilt pages pick up the new skills.
 */

import Database from 'better-sqlite3';
import path from 'path';
import { SKILL_SEED } from '../src/lib/skill-seed.js';

const dbPath = process.env.DATABASE_URL
  ? path.isAbsolute(process.env.DATABASE_URL)
    ? process.env.DATABASE_URL
    : path.join(process.cwd(), process.env.DATABASE_URL)
  : path.join(process.cwd(), 'portfolio.db');

async function migrateSkills(clearExisting) {
  const db = new Database(dbPath, { fileMustExist: true });
  try {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${dbPath}.backup-${stamp}`;
    await db.backup(backupPath);
    console.log(`✓ Backup written to ${backupPath}`);

    const before = db.prepare('SELECT COUNT(*) AS count FROM skills').get().count;
    const insertSkill = db.prepare('INSERT INTO skills (name, category, proficiency, icon, description) VALUES (?, ?, ?, ?, ?)');

    db.transaction(() => {
      if (clearExisting) db.prepare('DELETE FROM skills').run();
      for (const skill of SKILL_SEED) {
        insertSkill.run(skill.name, skill.category, skill.proficiency, null, null);
      }
    })();

    if (clearExisting) console.log(`✓ Removed ${before} existing skills`);
    console.log(`✓ Inserted ${SKILL_SEED.length} skills`);

    const categoryCounts = db.prepare('SELECT category, COUNT(*) AS count FROM skills GROUP BY category ORDER BY category').all();
    console.log('\nSkills by category:');
    categoryCounts.forEach(({ category, count }) => console.log(`  ${category}: ${count}`));
  } catch (error) {
    console.error('Error migrating skills:', error);
    process.exitCode = 1;
  } finally {
    db.close();
  }
}

const clearExisting = process.argv.slice(2).includes('--clear');

console.log('Skills Migration Script');
console.log('======================\n');
console.log(`Database: ${dbPath}`);
if (clearExisting) console.log('⚠️  All existing skills will be replaced.\n');

migrateSkills(clearExisting);
