import { refreshSite } from '@/lib/revalidate';
import { getDatabase } from '@/lib/database';
import { saveProject } from '@/lib/project-store';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const result = saveProject(await request.json(), Number(id));
    if (result.errors) {
      return Response.json({ success: false, error: 'Please fix the highlighted fields.', errors: result.errors }, { status: 400 });
    }
    if (result.notFound) {
      return Response.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    refreshSite();
    return Response.json({ success: true, message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    return Response.json({ success: false, error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    const db = getDatabase();
    const result = db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    
    if (result.changes > 0) {
      refreshSite();
      return Response.json({ success: true, message: 'Project deleted successfully' });
    } else {
      return Response.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    return Response.json({ success: false, error: 'Failed to delete project' }, { status: 500 });
  }
}
