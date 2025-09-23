import { getDatabase } from '@/lib/database';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { read } = body;
    
    const db = getDatabase();
    const result = db.prepare(
      'UPDATE contact_messages SET read = ? WHERE id = ?'
    ).run(read, id);
    
    if (result.changes > 0) {
      return Response.json({ success: true, message: 'Message updated successfully' });
    } else {
      return Response.json({ success: false, error: 'Message not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating message:', error);
    return Response.json({ success: false, error: 'Failed to update message' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const db = getDatabase();
    const result = db.prepare('DELETE FROM contact_messages WHERE id = ?').run(id);
    
    if (result.changes > 0) {
      return Response.json({ success: true, message: 'Message deleted successfully' });
    } else {
      return Response.json({ success: false, error: 'Message not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting message:', error);
    return Response.json({ success: false, error: 'Failed to delete message' }, { status: 500 });
  }
}
