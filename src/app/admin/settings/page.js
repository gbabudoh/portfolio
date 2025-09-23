'use client';

import { useState } from 'react';
import { Settings, Save, Database, Palette, Shield, Info, ArrowLeft } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteTitle: 'Godwin - AI-Enhanced Full-Stack Developer',
    siteDescription: 'Professional portfolio showcasing full-stack development, mobile apps, e-commerce solutions, and AI-enhanced development workflows.',
    contactEmail: 'contact@godwin.dev',
    analyticsEnabled: true,
    darkModeDefault: false,
    maintenanceMode: false
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate saving settings
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  const settingSections = [
    {
      title: 'Site Information',
      icon: Info,
      settings: [
        {
          key: 'siteTitle',
          label: 'Site Title',
          type: 'text',
          description: 'The main title displayed on your portfolio'
        },
        {
          key: 'siteDescription',
          label: 'Site Description',
          type: 'textarea',
          description: 'Meta description for SEO purposes'
        },
        {
          key: 'contactEmail',
          label: 'Contact Email',
          type: 'email',
          description: 'Primary email address for contact form submissions'
        }
      ]
    },
    {
      title: 'Appearance',
      icon: Palette,
      settings: [
        {
          key: 'darkModeDefault',
          label: 'Default Dark Mode',
          type: 'checkbox',
          description: 'Enable dark mode by default for new visitors'
        }
      ]
    },
    {
      title: 'Functionality',
      icon: Settings,
      settings: [
        {
          key: 'analyticsEnabled',
          label: 'Enable Analytics',
          type: 'checkbox',
          description: 'Track visitor analytics and portfolio performance'
        },
        {
          key: 'maintenanceMode',
          label: 'Maintenance Mode',
          type: 'checkbox',
          description: 'Put the site in maintenance mode (admin only access)'
        }
      ]
    }
  ];

  const renderSettingInput = (setting) => {
    switch (setting.type) {
      case 'textarea':
        return (
          <textarea
            value={settings[setting.key]}
            onChange={(e) => handleChange(setting.key, e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
          />
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={settings[setting.key]}
            onChange={(e) => handleChange(setting.key, e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2"
          />
        );
      case 'email':
        return (
          <input
            type="email"
            value={settings[setting.key]}
            onChange={(e) => handleChange(setting.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        );
      default:
        return (
          <input
            type="text"
            value={settings[setting.key]}
            onChange={(e) => handleChange(setting.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Configure your portfolio settings and preferences
            </p>
          </div>
          <a
            href="/admin"
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </a>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {settingSections.map((section) => (
          <div key={section.title} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <section.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {section.settings.map((setting) => (
                <div key={setting.key}>
                  <div className="flex items-start space-x-4">
                    {setting.type === 'checkbox' && (
                      <div className="pt-1">
                        {renderSettingInput(setting)}
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {setting.label}
                      </label>
                      {setting.type !== 'checkbox' && renderSettingInput(setting)}
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {setting.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Database Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Database className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Database Information
              </h3>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Database Type:</span>
                <span className="ml-2 text-gray-900 dark:text-white font-medium">SQLite</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Location:</span>
                <span className="ml-2 text-gray-900 dark:text-white font-medium">portfolio.db</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Tables:</span>
                <span className="ml-2 text-gray-900 dark:text-white font-medium">4</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Status:</span>
                <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                  Connected
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Security & Access
              </h3>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Admin Access</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Access to admin panel and database</p>
                </div>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                  Active
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Database Security</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">SQLite database with prepared statements</p>
                </div>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                  Secure
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
