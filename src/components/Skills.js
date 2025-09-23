'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Code, Database, Smartphone, Palette, Brain, Server, FileText, Globe, Terminal } from 'lucide-react';

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/skills');
      const data = await response.json();
      if (data.success) {
        setSkills(data.data);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const categories = ['All', 'Languages', 'Frontend', 'Backend', 'Database', 'Mobile', 'Styling', 'Specialized'];
  
  const filteredSkills = activeCategory === 'All' 
    ? skills 
    : skills.filter(skill => skill.category === activeCategory);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Languages': return Code;
      case 'Frontend': return Code;
      case 'Backend': return Server;
      case 'Database': return Database;
      case 'Mobile': return Smartphone;
      case 'Styling': return Palette;
      case 'Specialized': return Brain;
      default: return Code;
    }
  };

  const getLanguageIcon = (skillName) => {
    switch (skillName.toLowerCase()) {
      case 'javascript': return Terminal;
      case 'typescript': return Terminal;
      case 'php': return Terminal;
      case 'python': return Terminal;
      case 'html5': return FileText;
      case 'css3': return Globe;
      default: return Code;
    }
  };

  const getProficiencyColor = (proficiency) => {
    if (proficiency >= 5) return 'from-green-500 to-green-600';
    if (proficiency >= 4) return 'from-blue-500 to-blue-600';
    if (proficiency >= 3) return 'from-yellow-500 to-yellow-600';
    return 'from-gray-400 to-gray-500';
  };

  return (
    <section id="skills" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Technical Skills
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            My expertise spans across multiple technologies and platforms, enabling me to deliver comprehensive solutions for any project.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
                              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    {React.createElement(
                      skill.category === 'Languages' ? getLanguageIcon(skill.name) : getCategoryIcon(skill.category), 
                      {
                        className: "w-5 h-5 text-blue-600 dark:text-blue-400"
                      }
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {skill.name}
                  </h3>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {skill.category}
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {skill.description}
              </p>
              
              {/* Proficiency Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Proficiency</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {skill.proficiency}/5
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(skill.proficiency / 5) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    viewport={{ once: true }}
                    className={`h-2 rounded-full bg-gradient-to-r ${getProficiencyColor(skill.proficiency)}`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Skills Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              AI-Enhanced Development Workflow
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
              I leverage cutting-edge AI tools including Cursor, Windsurf, Kiro, ChatGPT, Sora, Google ImageFX, 
              Claude Code, and Gemini CLI to accelerate development while maintaining code quality and creativity.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full">Cursor AI</span>
              <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full">Windsurf</span>
              <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full">Kiro</span>
              <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full">ChatGPT</span>
              <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full">Sora</span>
              <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full">Google ImageFX</span>
              <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full">Claude Code</span>
              <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full">Gemini CLI</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
