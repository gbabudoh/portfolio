'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ExternalLink, Github, Eye, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import CloudinaryImage from './CloudinaryImage';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Marketing & Content Platforms');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openTabs, setOpenTabs] = useState({
    technologies: false,
    technicalSkills: false
  });
  const [cardOpenTabs, setCardOpenTabs] = useState({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const categories = ['Marketing & Content Platforms', 'SaaS & Productivity', 'Commerce & Marketplaces', 'AI & Data Intelligence', 'Interactive & Media', 'Mobile Applications', 'Design & Strategy Case Studies'];
  
  const filteredProjects = projects.filter(project => project.category === activeCategory);

  const openProjectModal = (project) => {
    setSelectedProject(project);
    // Reset tabs when opening a new project
    setOpenTabs({
      technologies: false,
      technicalSkills: false
    });
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    // Reset tabs when closing modal
    setOpenTabs({
      technologies: false,
      technicalSkills: false
    });
  };

  const toggleTab = (tabName) => {
    setOpenTabs(prev => ({
      ...prev,
      [tabName]: !prev[tabName]
    }));
  };

  const toggleCardTab = (projectId, tabName) => {
    setCardOpenTabs(prev => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [tabName]: !prev[projectId]?.[tabName]
      }
    }));
  };

  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800" aria-labelledby="projects-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Accordion Tab */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-700 shadow-lg"
        >
          {/* Tab Header */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex flex-col items-center justify-center p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-colors relative"
          >
            <h2 id="projects-heading" className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Featured Projects
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              A showcase of my diverse portfolio, from community platforms to enterprise solutions
            </p>
            {isOpen ? (
              <ChevronUp className="w-8 h-8 text-gray-600 dark:text-gray-400 absolute right-8 top-1/2 -translate-y-1/2" />
            ) : (
              <ChevronDown className="w-8 h-8 text-gray-600 dark:text-gray-400 absolute right-8 top-1/2 -translate-y-1/2" />
            )}
          </button>

          {/* Tab Content */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-gray-200 dark:border-gray-700"
            >
              <div className="p-8">
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-center mb-12">
                  Demonstrating my full-stack capabilities across various industries and technologies.
                </p>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                        activeCategory === category
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Projects Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProjects.map((project, index) => (
            <article
              key={project.id}
              className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-gray-600"
            >
              {/* Project Image */}
              <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 overflow-hidden">
                {project.image_url ? (
                  <img
                    src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_400,h_225,c_fill,g_auto,q_auto,f_auto/${project.image_public_id}`}
                    alt={`${project.title} - ${project.description} - Built with ${project.technologies}`}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl text-blue-400 dark:text-blue-500">🚀</div>
                  </div>
                )}
                {project.featured && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Featured
                  </div>
                )}
              </div>

              {/* Project Content */}
              <div className="p-6">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full mb-3">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Technologies & Technical Skills Accordions */}
                <div className="mb-4 space-y-2">
                  {/* Technologies Accordion */}
                  {project.technologies && (
                    <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleCardTab(project.id, 'technologies')}
                        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-600/50 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Technologies</span>
                        {cardOpenTabs[project.id]?.technologies ? (
                          <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        )}
                      </button>
                      {cardOpenTabs[project.id]?.technologies && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-3 py-2 bg-white dark:bg-gray-700"
                        >
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.split(', ').filter(t => t.trim()).map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Technical Skills Accordion */}
                  {project.technical_skills && (
                    <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleCardTab(project.id, 'technicalSkills')}
                        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-600/50 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Technical Skills</span>
                        {cardOpenTabs[project.id]?.technicalSkills ? (
                          <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        )}
                      </button>
                      {cardOpenTabs[project.id]?.technicalSkills && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-3 py-2 bg-white dark:bg-gray-700"
                        >
                          <div className="flex flex-wrap gap-2">
                            {project.technical_skills.split(', ').filter(t => t.trim()).map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => openProjectModal(project)}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors duration-300"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </button>
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </article>
                  ))}
                </div>

                {/* View All Projects CTA */}
                <div className="text-center mt-12">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-2xl">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Ready to Start Your Project?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
                      Let&apos;s discuss how I can help bring your ideas to life with modern, scalable, and AI-enhanced development solutions.
                    </p>
                    <button
                      onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Get Started
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 shadow-2xl"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedProject.title}
                </h3>
                <button
                  onClick={closeProjectModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Project Image */}
                {selectedProject.image_url && (
                  <div className="w-full aspect-video rounded-lg overflow-hidden">
                    <img
                      src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_800,h_450,c_fill,g_auto,q_auto,f_auto/${selectedProject.image_public_id}`}
                      alt={`${selectedProject.title} - ${selectedProject.description} - Built with ${selectedProject.technologies}`}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                )}

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {selectedProject.long_description}
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Technologies Tab */}
                  {selectedProject.technologies && (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleTab('technologies')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Technologies:</h4>
                        {openTabs.technologies ? (
                          <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        )}
                      </button>
                      {openTabs.technologies && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-4 py-3"
                        >
                          <div className="space-y-2">
                            {selectedProject.technologies
                              .split(/[,\n]/)
                              .map(t => t.trim())
                              .filter(t => t.length > 0)
                              .map((tech, index) => (
                                <div
                                  key={index}
                                  className="text-gray-700 dark:text-gray-300"
                                >
                                  {tech}
                                </div>
                              ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Technical Skills Tab */}
                  {selectedProject.technical_skills && (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleTab('technicalSkills')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Technical Skills:</h4>
                        {openTabs.technicalSkills ? (
                          <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        )}
                      </button>
                      {openTabs.technicalSkills && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-4 py-3"
                        >
                          <div className="space-y-2">
                            {selectedProject.technical_skills
                              .split(/[,\n]/)
                              .map(t => t.trim())
                              .filter(t => t.length > 0)
                              .map((skill, index) => (
                                <div
                                  key={index}
                                  className="text-gray-700 dark:text-gray-300"
                                >
                                  {skill}
                                </div>
                              ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex space-x-4">
                  {selectedProject.live_url && (
                    <a
                      href={selectedProject.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </a>
                  )}
                  {selectedProject.github_url && (
                    <a
                      href={selectedProject.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      View Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}
