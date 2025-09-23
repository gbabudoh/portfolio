import { getDatabase } from '@/lib/database';

export async function GET() {
  try {
    const db = getDatabase();
    
    // Get total page views
    const totalPageViews = db.prepare('SELECT COUNT(*) as count FROM page_views').get();
    
    // Get unique visitors
    const uniqueVisitors = db.prepare('SELECT COUNT(*) as count FROM visitors').get();
    
    // Get today's stats
    const todayPageViews = db.prepare(`
      SELECT COUNT(*) as count FROM page_views 
      WHERE DATE(created_at) = DATE('now')
    `).get();
    
    const todayVisitors = db.prepare(`
      SELECT COUNT(*) as count FROM visitors 
      WHERE DATE(last_visit) = DATE('now')
    `).get();
    
    // Get this week's stats
    const weekPageViews = db.prepare(`
      SELECT COUNT(*) as count FROM page_views 
      WHERE created_at >= DATE('now', '-7 days')
    `).get();
    
    const weekVisitors = db.prepare(`
      SELECT COUNT(*) as count FROM visitors 
      WHERE last_visit >= DATE('now', '-7 days')
    `).get();
    
    // Get this month's stats
    const monthPageViews = db.prepare(`
      SELECT COUNT(*) as count FROM page_views 
      WHERE created_at >= DATE('now', 'start of month')
    `).get();
    
    const monthVisitors = db.prepare(`
      SELECT COUNT(*) as count FROM visitors 
      WHERE last_visit >= DATE('now', 'start of month')
    `).get();
    
    // Get average engagement metrics
    const avgEngagement = db.prepare(`
      SELECT 
        AVG(time_on_page) as avg_time_on_page,
        AVG(scroll_depth) as avg_scroll_depth,
        AVG(interactions) as avg_interactions
      FROM engagement_metrics
    `).get();
    
    // Get top pages
    const topPages = db.prepare(`
      SELECT page_path, COUNT(*) as views
      FROM page_views
      GROUP BY page_path
      ORDER BY views DESC
      LIMIT 5
    `).all();
    
    // Get recent visitors
    const recentVisitors = db.prepare(`
      SELECT visitor_id, last_visit, total_visits, total_page_views
      FROM visitors
      ORDER BY last_visit DESC
      LIMIT 10
    `).all();
    
    return Response.json({
      success: true,
      data: {
        total: {
          pageViews: totalPageViews.count,
          visitors: uniqueVisitors.count
        },
        today: {
          pageViews: todayPageViews.count,
          visitors: todayVisitors.count
        },
        week: {
          pageViews: weekPageViews.count,
          visitors: weekVisitors.count
        },
        month: {
          pageViews: monthPageViews.count,
          visitors: monthVisitors.count
        },
        engagement: {
          avgTimeOnPage: Math.round(avgEngagement.avg_time_on_page || 0),
          avgScrollDepth: Math.round((avgEngagement.avg_scroll_depth || 0) * 100),
          avgInteractions: Math.round(avgEngagement.avg_interactions || 0)
        },
        topPages,
        recentVisitors
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return Response.json({ success: false, error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
