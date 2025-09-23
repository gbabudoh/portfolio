'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Briefcase, 
  MessageSquare, 
  TrendingUp,
  Users,
  Calendar,
  Star,
  Activity
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    skills: 0,
    projects: 0,
    experience: 0,
    messages: 0
  });

  const [analytics, setAnalytics] = useState({
    total: { pageViews: 0, visitors: 0 },
    today: { pageViews: 0, visitors: 0 },
    week: { pageViews: 0, visitors: 0 },
    month: { pageViews: 0, visitors: 0 },
    engagement: { avgTimeOnPage: 0, avgScrollDepth: 0, avgInteractions: 0 },
    topPages: [],
    recentVisitors: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchAnalytics();
  }, []);

  const fetchStats = async () => {
    try {
      const [skillsRes, projectsRes, experienceRes, messagesRes] = await Promise.all([
        fetch('/api/skills'),
        fetch('/api/projects'),
        fetch('/api/experience'),
        fetch('/api/contact')
      ]);

      const skillsData = await skillsRes.json();
      const projectsData = await projectsRes.json();
      const experienceData = await experienceRes.json();
      const messagesData = await messagesRes.json();

      setStats({
        skills: skillsData.success ? skillsData.data.length : 0,
        projects: projectsData.success ? projectsData.data.length : 0,
        experience: experienceData.success ? experienceData.data.length : 0,
        messages: messagesData.success ? messagesData.data.length : 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/stats');
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Add Skill',
      description: 'Add a new technical skill',
      href: '/admin/skills',
      icon: Code,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Add Project',
      description: 'Add a new portfolio project',
      href: '/admin/projects',
      icon: Briefcase,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Add Experience',
      description: 'Add work experience',
      href: '/admin/experience',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'View Messages',
      description: 'Check contact form submissions',
      href: '/admin/messages',
      icon: MessageSquare,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="max-w-full space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Admin Dashboard
        </h1>
        <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300">
          Manage your portfolio content and monitor activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Skills</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{stats.skills}</p>
            </div>
            <div className="p-2 lg:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Code className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{stats.projects}</p>
            </div>
            <div className="p-2 lg:p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Briefcase className="w-5 h-5 lg:w-6 lg:h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Experience</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{stats.experience}</p>
            </div>
            <div className="p-2 lg:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Messages</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{stats.messages}</p>
            </div>
            <div className="p-2 lg:p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <MessageSquare className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.a
                key={action.title}
                href={action.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="text-center">
                  <div className={`w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r ${action.color} rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {action.title}
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-xl shadow-lg">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6">Recent Activity</h2>
        <div className="text-center py-6 lg:py-8">
          <Activity className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
            Activity tracking will be implemented in future updates
          </p>
        </div>
      </div>

      {/* Portfolio Performance */}
      <div className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-xl shadow-lg">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6">Portfolio Performance</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* Main Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-6">
              <div className="text-center">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                  <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-2">Page Views</h3>
                <p className="text-2xl lg:text-3xl font-bold text-blue-600">{analytics.total.pageViews}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Today: {analytics.today.pageViews}</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                  <Users className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-2">Visitors</h3>
                <p className="text-2xl lg:text-3xl font-bold text-green-600">{analytics.total.visitors}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Today: {analytics.today.visitors}</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                  <Star className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-2">Engagement</h3>
                <p className="text-2xl lg:text-3xl font-bold text-purple-600">{analytics.engagement.avgTimeOnPage}s</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Avg. time on page</p>
              </div>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Pages */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Top Pages</h3>
                <div className="space-y-2">
                  {analytics.topPages.length > 0 ? (
                    analytics.topPages.map((page, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{page.page_path}</span>
                        <span className="text-sm font-semibold text-blue-600">{page.views} views</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No page views yet</p>
                  )}
                </div>
              </div>

              {/* Engagement Metrics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Engagement Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Scroll Depth</span>
                    <span className="text-sm font-semibold text-green-600">{analytics.engagement.avgScrollDepth}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Interactions</span>
                    <span className="text-sm font-semibold text-purple-600">{analytics.engagement.avgInteractions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">This Week</span>
                    <span className="text-sm font-semibold text-blue-600">{analytics.week.pageViews} views</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">This Month</span>
                    <span className="text-sm font-semibold text-orange-600">{analytics.month.pageViews} views</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
