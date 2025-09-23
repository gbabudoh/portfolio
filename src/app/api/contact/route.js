import { getDatabase } from '@/lib/database';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;
    
    // Basic validation
    if (!name || !email || !subject || !message) {
      return Response.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }
    
    const db = getDatabase();
    const result = db.prepare(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)'
    ).run(name, email, subject, message);
    
    return Response.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error saving contact message:', error);
    return Response.json({ success: false, error: 'Failed to save message' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = getDatabase();
    const messages = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
    
    return Response.json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return Response.json({ success: false, error: 'Failed to fetch messages' }, { status: 500 });
  }
}
