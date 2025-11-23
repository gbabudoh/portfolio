'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Code, Users, Globe, Smartphone } from 'lucide-react';
import ProjectCounter from './ProjectCounter';

export default function About() {
  const [aboutContent, setAboutContent] = useState({});
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutContent();
    fetchStats();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const response = await fetch('/api/about');
      const result = await response.json();
      
      if (result.success) {
        // Convert array to object for easier access
        const contentObj = {};
        result.data.forEach(item => {
          contentObj[item.section] = item;
        });
        setAboutContent(contentObj);
      }
    } catch (error) {
      console.error('Error fetching about content:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getColorClass = (color) => {
    const colorMap = {
      blue: 'text-blue-600 dark:text-blue-400',
      purple: 'text-purple-600 dark:text-purple-400',
      green: 'text-green-600 dark:text-green-400',
      orange: 'text-orange-600 dark:text-orange-400',
      red: 'text-red-600 dark:text-red-400',
      pink: 'text-pink-600 dark:text-pink-400',
      indigo: 'text-indigo-600 dark:text-indigo-400',
    };
    return colorMap[color] || colorMap.blue;
  };

  const features = [
    {
      icon: Brain,
      title: 'High-Velocity Engineering',
      description: 'Utilising an AI-native development stack to accelerate feature delivery by 50% while maintaining strict code quality and architectural standards.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Code,
      title: 'End-to-End Architecture',
      description: 'Architecting seamless, scalable ecosystems-bridging reactive frontends with robust backends and cloud-native infrastructure.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Users,
      title: 'Strategic Product Engineering',
      description: 'Translating complex business requirements into high-impact technical execution, ensuring every feature aligns with user needs and ROI.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Globe,
      title: 'Unified Digital Ecosystems',
      description: 'Delivering cohesive, high-performance experiences across Web and Mobile-powered by shared architecture and unified backend logic.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Smartphone,
      title: 'Native-Grade Mobile Experiences',
      description: 'Engineering fluid, high-performance iOS and Android applications using leading cross-platform frameworks (React Native, Flutter). I deliver seamless, native-quality user experiences with maximum code efficiency and reach.',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: Zap,
      title: 'High-Performance Engineering',
      description: 'Delivering sub-second load times and top-tier Core Web Vitals. I architect systems for maximum speed, SEO visibility, and scalable user retention.',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About Me
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {loading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              aboutContent.main_description?.content || "Full Stack Engineer leveraging intelligent automation to build robust Web, Mobile, and Commerce ecosystems faster and more reliably."
            )}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Transforming Ideas Into Digital Reality
            </h3>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              {loading ? (
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                </div>
              ) : (
                <>
                  <p>
                    {aboutContent.experience_paragraph?.content || "With over 4 years of experience in full-stack development, I've built a reputation for delivering comprehensive solutions that go beyond just websites. My expertise spans from community platforms to enterprise business solutions, mobile applications, and e-commerce platforms."}
                  </p>
                  <p>
                    {aboutContent.ai_integration?.content || "What sets me apart is my integration of AI-powered development tools, including Cursor, Windsurf, Kiro, ChatGPT, Sora, and Google ImageFX. This approach enables me to deliver projects 40-60% faster while maintaining the highest quality standards."}
                  </p>
                  <p>
                    {aboutContent.specialization?.content || "I specialize in understanding business requirements and architecting solutions that not only meet technical needs but also drive business growth. From simple community websites to complex enterprise systems, I ensure every project is built with scalability, performance, and user experience in mind."}
                  </p>
                </>
              )}
            </div>
          </motion.div>

          {/* Right Column - Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => {
              // Special handling for production_projects - use automatic counter
              if (stat.key === 'production_projects') {
                return (
                  <div key={stat.id} className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600">
                    <div className={`text-3xl font-bold ${getColorClass(stat.color)} mb-2`}>
                      <ProjectCounter 
                        className={`text-3xl font-bold ${getColorClass(stat.color)}`}
                        prefix=""
                        suffix="+"
                        animate={true}
                      />
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
                  </div>
                );
              }
              
              // Regular stats
              return (
                <div key={stat.id} className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600">
                  <div className={`text-3xl font-bold ${getColorClass(stat.color)} mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            What I Bring to Every Project
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} text-white mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
