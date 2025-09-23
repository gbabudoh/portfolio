'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ProjectCounter({ 
  showFeatured = false, 
  showCategories = false, 
  className = '',
  prefix = 'Proven track record with ',
  suffix = '+ production projects',
  animate = true 
}) {
  const [actualCount, setActualCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const [featuredCount, setFeaturedCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectCount();
  }, []);

  const fetchProjectCount = async () => {
    try {
      const response = await fetch('/api/projects/count');
      const result = await response.json();
      
      if (result.success) {
        setActualCount(result.data.total);
        setFeaturedCount(result.data.featured);
        setCategories(result.data.categories);
      }
    } catch (error) {
      console.error('Error fetching project count:', error);
    } finally {
      setLoading(false);
    }
  };

  // Animate counter from 0 to actual count
  useEffect(() => {
    if (actualCount > 0 && animate) {
      const duration = 2000; // 2 seconds
      const steps = 60; // 60 steps for smooth animation
      const increment = actualCount / steps;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const animatedCount = Math.min(Math.floor(increment * currentStep), actualCount);
        setDisplayCount(animatedCount);
        
        if (currentStep >= steps) {
          clearInterval(timer);
          setDisplayCount(actualCount); // Ensure final count is exact
        }
      }, stepDuration);
      
      return () => clearInterval(timer);
    } else if (actualCount > 0 && !animate) {
      // If animation is disabled, just set the count directly
      setDisplayCount(actualCount);
    }
  }, [actualCount, animate]);

  if (loading) {
    return (
      <span className={`${className} animate-pulse`}>
        {prefix}...{suffix}
      </span>
    );
  }

  return (
    <div className={className}>
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-block"
      >
        {prefix}
        <motion.span
          key={displayCount}
          initial={{ scale: 1.2, color: '#3b82f6' }}
          animate={{ scale: 1, color: 'inherit' }}
          transition={{ duration: 0.3 }}
          className="font-bold text-blue-500"
        >
          {displayCount}
        </motion.span>
        {suffix}
      </motion.span>
      
      {showFeatured && featuredCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-sm text-gray-600 dark:text-gray-400 mt-1"
        >
          Including {featuredCount} featured projects
        </motion.div>
      )}
      
      {showCategories && categories.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-sm text-gray-600 dark:text-gray-400 mt-2"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.slice(0, 3).map((category, index) => (
              <span
                key={category.category}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs"
              >
                {category.count} {category.category}
              </span>
            ))}
            {categories.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                +{categories.length - 3} more
              </span>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
