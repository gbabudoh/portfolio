import { refreshSite } from '@/lib/revalidate';
import { getDatabase } from '@/lib/database';
import { reorderProjects } from '@/lib/project-store';

// Admin only — enforced by middleware (only GET is public under /api/projects).
// Body: { ids: [every project id in the new order] }
export async function POST(request) {
  try {
    const { ids } = await request.json();
    const known = getDatabase().prepare('SELECT id FROM projects').all().map((r) => r.id);
    const valid =
      Array.isArray(ids) &&
      ids.length === known.length &&
      new Set(ids).size === ids.length &&
      ids.every((id) => known.includes(id));
    if (!valid) {
      return Response.json({ success: false, error: 'The order must list every project exactly once.' }, { status: 400 });
    }
    reorderProjects(ids);
    refreshSite();
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error reordering projects:', error);
    return Response.json({ success: false, error: 'Failed to reorder projects' }, { status: 500 });
  }
}
