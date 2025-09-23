import { getDatabase } from '@/lib/database';
import { headers } from 'next/headers';

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, data } = body;
    
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';
    const referrer = headersList.get('referer') || '';
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || '127.0.0.1';
    
    const db = getDatabase();
    
    if (type === 'page_view') {
      const { page_path, visitor_id, session_id } = data;
      
      // Insert page view
      db.prepare(`
        INSERT INTO page_views (page_path, visitor_id, session_id, user_agent, referrer, ip_address)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(page_path, visitor_id, session_id, userAgent, referrer, ip);
      
      // Update visitor stats
      const visitor = db.prepare('SELECT * FROM visitors WHERE visitor_id = ?').get(visitor_id);
      if (visitor) {
        db.prepare(`
          UPDATE visitors 
          SET last_visit = CURRENT_TIMESTAMP, 
              total_visits = total_visits + 1,
              total_page_views = total_page_views + 1
          WHERE visitor_id = ?
        `).run(visitor_id);
      } else {
        db.prepare(`
          INSERT INTO visitors (visitor_id, first_visit, last_visit, total_visits, total_page_views)
          VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1)
        `).run(visitor_id);
      }
      
    } else if (type === 'engagement') {
      const { visitor_id, session_id, page_path, time_on_page, scroll_depth, interactions, exit_page } = data;
      
      db.prepare(`
        INSERT INTO engagement_metrics (visitor_id, session_id, page_path, time_on_page, scroll_depth, interactions, exit_page)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(visitor_id, session_id, page_path, time_on_page, scroll_depth, interactions, exit_page ? 1 : 0);
    }
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error tracking analytics:', error);
    return Response.json({ success: false, error: 'Failed to track analytics' }, { status: 500 });
  }
}
