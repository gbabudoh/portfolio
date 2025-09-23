import { getDatabase } from '@/lib/database';

export async function GET() {
  try {
    const db = getDatabase();
    
    // Get total project count
    const totalCount = db.prepare('SELECT COUNT(*) as count FROM projects').get();
    
    // Get featured project count
    const featuredCount = db.prepare('SELECT COUNT(*) as count FROM projects WHERE featured = 1').get();
    
    // Get projects by category
    const categoryStats = db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM projects 
      GROUP BY category 
      ORDER BY count DESC
    `).all();
    
    return Response.json({
      success: true,
      data: {
        total: totalCount.count,
        featured: featuredCount.count,
        categories: categoryStats
      }
    });
  } catch (error) {
    console.error('Error getting project count:', error);
    return Response.json({ 
      success: false, 
      error: 'Failed to get project count' 
    }, { status: 500 });
  }
}
