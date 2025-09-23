'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Edit3, FileText } from 'lucide-react';

export default function AboutManagement() {
  const [aboutContent, setAboutContent] = useState([]);
  const [editingSection, setEditingSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const response = await fetch('/api/about');
      const result = await response.json();
      
      if (result.success) {
        setAboutContent(result.data);
      }
    } catch (error) {
      console.error('Error fetching about content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section) => {
    setSaving(true);
    try {
      const content = aboutContent.find(item => item.section === section);
      
      const response = await fetch('/api/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section: content.section,
          title: content.title,
          content: content.content
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage('Content saved successfully!');
        setEditingSection(null);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error saving content');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving content:', error);
      setMessage('Error saving content');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleContentChange = (section, field, value) => {
    setAboutContent(prev => 
      prev.map(item => 
        item.section === section 
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          About Content Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage the content displayed in your About section
        </p>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg mb-6 ${
            message.includes('success') 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
          }`}
        >
          {message}
        </motion.div>
      )}

      <div className="space-y-6">
        {aboutContent.map((section, index) => (
          <motion.div
            key={section.section}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {section.title || section.section.replace('_', ' ').toUpperCase()}
                </h3>
              </div>
              <div className="flex space-x-2">
                {editingSection === section.section ? (
                  <button
                    onClick={() => handleSave(section.section)}
                    disabled={saving}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingSection(section.section)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                {editingSection === section.section ? (
                  <input
                    type="text"
                    value={section.title || ''}
                    onChange={(e) => handleContentChange(section.section, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Section title"
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    {section.title || 'No title set'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content
                </label>
                {editingSection === section.section ? (
                  <textarea
                    value={section.content}
                    onChange={(e) => handleContentChange(section.section, 'content', e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-vertical"
                    placeholder="Section content"
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {section.content}
                  </p>
                )}
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400">
                Last updated: {new Date(section.updated_at).toLocaleDateString()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
