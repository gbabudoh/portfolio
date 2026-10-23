import { refreshSite } from '@/lib/revalidate';
import { getSession } from '@/lib/auth';
import { listProjects, saveProject } from '@/lib/project-store';

// Public GET (allow-listed in middleware) returns published projects only;
// signed-in admins also get drafts.
export async function GET() {
  try {
    const includeDrafts = Boolean(await getSession());
    return Response.json({ success: true, data: listProjects({ includeDrafts }) });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return Response.json({ success: false, error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const result = saveProject(await request.json());
    if (result.errors) {
      return Response.json({ success: false, error: 'Please fix the highlighted fields.', errors: result.errors }, { status: 400 });
    }
    refreshSite();
    return Response.json({ success: true, id: result.id });
  } catch (error) {
    console.error('Error creating project:', error);
    return Response.json({ success: false, error: 'Failed to create project' }, { status: 500 });
  }
}
