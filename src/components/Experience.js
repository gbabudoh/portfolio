'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const response = await fetch('/api/experience');
      const data = await response.json();
      if (data.success) {
        setExperiences(data.data);
        // Auto-expand the most recent entry
        if (data.data.length > 0) setExpandedId(data.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching experience:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!loading && experiences.length === 0) return null;

  return (
    <section id="experience" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Work Experience
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A track record of delivering real-world, production-grade solutions across diverse industries.
          </p>
        </motion.div>

        {loading ? (
          <div className="space-y-4 max-w-3xl mx-auto">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl p-6">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative max-w-3xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-blue-500 hidden sm:block" aria-hidden="true" />

            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative sm:pl-20"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 border-2 border-white dark:border-gray-900 shadow hidden sm:block" aria-hidden="true" />

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                    {/* Header — always visible */}
                    <button
                      onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                      aria-expanded={expandedId === exp.id}
                      className="w-full text-left p-6 flex items-start justify-between gap-4 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-start gap-4 min-w-0">
                        <div className="p-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex-shrink-0">
                          <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">
                            {exp.position}
                          </h3>
                          <p className="text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                            {exp.company}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(exp.start_date)} — {exp.current ? 'Present' : formatDate(exp.end_date)}
                            </span>
                            {exp.current && (
                              <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedId === exp.id ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0 mt-1"
                      >
                        <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </motion.div>
                    </button>

                    {/* Expanded content */}
                    {expandedId === exp.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 dark:border-gray-700 px-6 pb-6 pt-4 space-y-4"
                      >
                        {exp.description && (
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                            {exp.description}
                          </p>
                        )}

                        {exp.achievements && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Key Achievements</h4>
                            <ul className="space-y-1.5">
                              {exp.achievements.split('\n').filter(a => a.trim()).map((achievement, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                  {achievement.replace(/^[-•*]\s*/, '')}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {exp.technologies && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Technologies Used</h4>
                            <div className="flex flex-wrap gap-2">
                              {exp.technologies.split(',').map(t => t.trim()).filter(Boolean).map((tech, i) => (
                                <span key={i} className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
