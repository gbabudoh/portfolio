/**
 * Migration script to update skills database with new structure
 * Run this script to update existing skills or populate new database
 * 
 * Usage: node scripts/migrate-skills.js [--clear]
 *   --clear: Clear all existing skills before inserting new ones
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DATABASE_URL
  ? path.isAbsolute(process.env.DATABASE_URL)
    ? process.env.DATABASE_URL
    : path.join(process.cwd(), process.env.DATABASE_URL)
  : path.join(process.cwd(), 'portfolio.db');

const db = new Database(dbPath);

const newSkills = [
  // 1. Ideation & Design
  { name: 'User Stories', category: 'Ideation & Design', proficiency: 5, icon: 'design', description: 'Writing and managing user stories for requirements gathering' },
  { name: 'Requirements Gathering', category: 'Ideation & Design', proficiency: 5, icon: 'design', description: 'Collecting and analyzing project requirements' },
  { name: 'Feasibility Analysis', category: 'Ideation & Design', proficiency: 4, icon: 'design', description: 'Evaluating technical and business feasibility' },
  { name: 'Figma', category: 'Ideation & Design', proficiency: 4, icon: 'design', description: 'UI/UX design and prototyping tool' },
  { name: 'Adobe XD', category: 'Ideation & Design', proficiency: 3, icon: 'design', description: 'User experience design software' },
  { name: 'Sketch', category: 'Ideation & Design', proficiency: 3, icon: 'design', description: 'Digital design toolkit' },
  { name: 'Miro', category: 'Ideation & Design', proficiency: 4, icon: 'design', description: 'Collaborative whiteboarding platform' },
  { name: 'Jira', category: 'Ideation & Design', proficiency: 4, icon: 'design', description: 'Project management and issue tracking' },
  { name: 'Linear', category: 'Ideation & Design', proficiency: 3, icon: 'design', description: 'Issue tracking and project management' },
  { name: 'Trello', category: 'Ideation & Design', proficiency: 4, icon: 'design', description: 'Agile project management with boards' },
  { name: 'Agile/Scrum', category: 'Ideation & Design', proficiency: 4, icon: 'design', description: 'Agile development methodologies' },
  
  // 2. Languages
  { name: 'TypeScript', category: 'Languages', proficiency: 5, icon: 'typescript', description: 'Typed superset of JavaScript' },
  { name: 'JavaScript', category: 'Languages', proficiency: 5, icon: 'javascript', description: 'Core programming language for web development' },
  { name: 'Python', category: 'Languages', proficiency: 4, icon: 'python', description: 'Versatile programming language' },
  { name: 'Java', category: 'Languages', proficiency: 3, icon: 'java', description: 'Object-oriented programming language' },
  { name: 'C#', category: 'Languages', proficiency: 3, icon: 'csharp', description: 'Microsoft programming language' },
  { name: 'Go', category: 'Languages', proficiency: 3, icon: 'go', description: 'Google\'s statically typed language' },
  { name: 'Rust', category: 'Languages', proficiency: 2, icon: 'rust', description: 'Systems programming language' },
  { name: 'PHP', category: 'Languages', proficiency: 5, icon: 'php', description: 'Server-side scripting language' },
  
  // 3. Frontend
  { name: 'React', category: 'Frontend', proficiency: 5, icon: 'react', description: 'Modern React with hooks and context' },
  { name: 'Vue', category: 'Frontend', proficiency: 4, icon: 'vue', description: 'Progressive JavaScript framework' },
  { name: 'Angular', category: 'Frontend', proficiency: 3, icon: 'angular', description: 'TypeScript-based web framework' },
  { name: 'Svelte', category: 'Frontend', proficiency: 3, icon: 'svelte', description: 'Component-based framework' },
  { name: 'Next.js', category: 'Frontend', proficiency: 5, icon: 'nextjs', description: 'Full-stack React framework' },
  { name: 'Nuxt', category: 'Frontend', proficiency: 4, icon: 'nuxt', description: 'Vue.js meta-framework' },
  { name: 'Remix', category: 'Frontend', proficiency: 3, icon: 'remix', description: 'Full-stack web framework' },
  { name: 'Redux', category: 'Frontend', proficiency: 4, icon: 'redux', description: 'State management library' },
  { name: 'Zustand', category: 'Frontend', proficiency: 4, icon: 'zustand', description: 'Lightweight state management' },
  { name: 'TanStack Query', category: 'Frontend', proficiency: 4, icon: 'query', description: 'Data fetching and caching library' },
  
  // 4. Styling
  { name: 'Tailwind CSS', category: 'Styling', proficiency: 5, icon: 'tailwind', description: 'Utility-first CSS framework' },
  { name: 'SASS/SCSS', category: 'Styling', proficiency: 4, icon: 'sass', description: 'CSS preprocessor' },
  { name: 'CSS Modules', category: 'Styling', proficiency: 4, icon: 'css', description: 'Scoped CSS for components' },
  { name: 'Material UI', category: 'Styling', proficiency: 4, icon: 'mui', description: 'React component library' },
  { name: 'ShadCN', category: 'Styling', proficiency: 4, icon: 'shadcn', description: 'Re-usable component library' },
  { name: 'Ant Design', category: 'Styling', proficiency: 3, icon: 'antd', description: 'Enterprise-class UI design language' },
  { name: 'Radix UI', category: 'Styling', proficiency: 3, icon: 'radix', description: 'Unstyled component primitives' },
  { name: 'Framer Motion', category: 'Styling', proficiency: 4, icon: 'framer', description: 'Animation library for React' },
  { name: 'GSAP', category: 'Styling', proficiency: 3, icon: 'gsap', description: 'Professional animation library' },
  
  // 5. Mobile
  { name: 'React Native', category: 'Mobile', proficiency: 4, icon: 'react-native', description: 'Cross-platform mobile development' },
  { name: 'Flutter', category: 'Mobile', proficiency: 3, icon: 'flutter', description: 'Google\'s UI toolkit' },
  { name: 'Expo', category: 'Mobile', proficiency: 4, icon: 'expo', description: 'React Native development platform' },
  { name: 'Swift (iOS)', category: 'Mobile', proficiency: 2, icon: 'swift', description: 'iOS native development' },
  { name: 'Kotlin (Android)', category: 'Mobile', proficiency: 2, icon: 'kotlin', description: 'Android native development' },
  
  // 6. Backend
  { name: 'Node.js', category: 'Backend', proficiency: 5, icon: 'nodejs', description: 'Server-side JavaScript runtime' },
  { name: 'Express', category: 'Backend', proficiency: 5, icon: 'express', description: 'Web application framework for Node.js' },
  { name: 'NestJS', category: 'Backend', proficiency: 4, icon: 'nestjs', description: 'Progressive Node.js framework' },
  { name: 'Django', category: 'Backend', proficiency: 3, icon: 'django', description: 'Python web framework' },
  { name: 'FastAPI', category: 'Backend', proficiency: 3, icon: 'fastapi', description: 'Modern Python web framework' },
  { name: 'Spring Boot', category: 'Backend', proficiency: 3, icon: 'spring', description: 'Java application framework' },
  { name: 'Gin', category: 'Backend', proficiency: 3, icon: 'gin', description: 'Go web framework' },
  { name: '.NET', category: 'Backend', proficiency: 3, icon: 'dotnet', description: 'Microsoft development platform' },
  
  // 7. Database
  { name: 'PostgreSQL', category: 'Database', proficiency: 4, icon: 'postgresql', description: 'Advanced open-source relational database' },
  { name: 'MySQL', category: 'Database', proficiency: 5, icon: 'mysql', description: 'Relational database management' },
  { name: 'MongoDB', category: 'Database', proficiency: 4, icon: 'mongodb', description: 'NoSQL document database' },
  { name: 'Cassandra', category: 'Database', proficiency: 2, icon: 'cassandra', description: 'Distributed NoSQL database' },
  { name: 'DynamoDB', category: 'Database', proficiency: 3, icon: 'dynamodb', description: 'AWS NoSQL database service' },
  { name: 'Redis', category: 'Database', proficiency: 4, icon: 'redis', description: 'In-memory data structure store' },
  { name: 'Memcached', category: 'Database', proficiency: 3, icon: 'memcached', description: 'Distributed memory caching system' },
  { name: 'Prisma', category: 'Database', proficiency: 4, icon: 'prisma', description: 'Next-generation ORM' },
  { name: 'TypeORM', category: 'Database', proficiency: 3, icon: 'typeorm', description: 'TypeScript ORM' },
  { name: 'Sequelize', category: 'Database', proficiency: 3, icon: 'sequelize', description: 'Promise-based Node.js ORM' },
  { name: 'Drizzle', category: 'Database', proficiency: 3, icon: 'drizzle', description: 'TypeScript ORM' },
  
  // 8. APIs & Communication
  { name: 'REST', category: 'APIs & Communication', proficiency: 5, icon: 'api', description: 'RESTful API architecture' },
  { name: 'GraphQL', category: 'APIs & Communication', proficiency: 4, icon: 'graphql', description: 'Query language for APIs' },
  { name: 'gRPC', category: 'APIs & Communication', proficiency: 3, icon: 'grpc', description: 'High-performance RPC framework' },
  { name: 'TRPC', category: 'APIs & Communication', proficiency: 4, icon: 'trpc', description: 'End-to-end typesafe APIs' },
  { name: 'WebSockets', category: 'APIs & Communication', proficiency: 4, icon: 'websocket', description: 'Real-time bidirectional communication' },
  { name: 'Socket.io', category: 'APIs & Communication', proficiency: 4, icon: 'socketio', description: 'Real-time event-based communication' },
  { name: 'WebRTC', category: 'APIs & Communication', proficiency: 3, icon: 'webrtc', description: 'Real-time peer-to-peer communication' },
  { name: 'RabbitMQ', category: 'APIs & Communication', proficiency: 3, icon: 'rabbitmq', description: 'Message broker software' },
  { name: 'Kafka', category: 'APIs & Communication', proficiency: 2, icon: 'kafka', description: 'Distributed event streaming platform' },
  { name: 'BullMQ', category: 'APIs & Communication', proficiency: 3, icon: 'bullmq', description: 'Redis-based queue system' },
  
  // 9. Infrastructure (DevOps)
  { name: 'AWS', category: 'Infrastructure (DevOps)', proficiency: 4, icon: 'aws', description: 'Amazon Web Services cloud platform' },
  { name: 'Google Cloud', category: 'Infrastructure (DevOps)', proficiency: 3, icon: 'gcp', description: 'Google Cloud Platform' },
  { name: 'Azure', category: 'Infrastructure (DevOps)', proficiency: 3, icon: 'azure', description: 'Microsoft cloud platform' },
  { name: 'DigitalOcean', category: 'Infrastructure (DevOps)', proficiency: 4, icon: 'digitalocean', description: 'Cloud infrastructure provider' },
  { name: 'Vercel', category: 'Infrastructure (DevOps)', proficiency: 5, icon: 'vercel', description: 'Frontend deployment platform' },
  { name: 'Netlify', category: 'Infrastructure (DevOps)', proficiency: 4, icon: 'netlify', description: 'Web development platform' },
  { name: 'Docker', category: 'Infrastructure (DevOps)', proficiency: 4, icon: 'docker', description: 'Containerization platform' },
  { name: 'Kubernetes', category: 'Infrastructure (DevOps)', proficiency: 3, icon: 'kubernetes', description: 'Container orchestration' },
  { name: 'GitLab CI', category: 'Infrastructure (DevOps)', proficiency: 3, icon: 'gitlab', description: 'Continuous integration platform' },
  { name: 'Jenkins', category: 'Infrastructure (DevOps)', proficiency: 3, icon: 'jenkins', description: 'Automation server' },
  { name: 'Terraform', category: 'Infrastructure (DevOps)', proficiency: 3, icon: 'terraform', description: 'Infrastructure as code' },
  { name: 'Ansible', category: 'Infrastructure (DevOps)', proficiency: 2, icon: 'ansible', description: 'Configuration management' },
  { name: 'Nginx', category: 'Infrastructure (DevOps)', proficiency: 4, icon: 'nginx', description: 'Web server and reverse proxy' },
  { name: 'Apache', category: 'Infrastructure (DevOps)', proficiency: 3, icon: 'apache', description: 'Web server software' },
  
  // 10. Security
  { name: 'OAuth 2.0', category: 'Security', proficiency: 4, icon: 'oauth', description: 'Authorization framework' },
  { name: 'OIDC', category: 'Security', proficiency: 3, icon: 'oidc', description: 'OpenID Connect authentication' },
  { name: 'JWT', category: 'Security', proficiency: 4, icon: 'jwt', description: 'JSON Web Token authentication' },
  { name: 'Auth0', category: 'Security', proficiency: 3, icon: 'auth0', description: 'Identity and access management' },
  { name: 'Clerk', category: 'Security', proficiency: 3, icon: 'clerk', description: 'Authentication and user management' },
  { name: 'Supabase Auth', category: 'Security', proficiency: 3, icon: 'supabase', description: 'Open-source authentication' },
  { name: 'CORS', category: 'Security', proficiency: 4, icon: 'security', description: 'Cross-origin resource sharing' },
  { name: 'OWASP Top 10', category: 'Security', proficiency: 4, icon: 'security', description: 'Web application security practices' },
  { name: 'Rate Limiting', category: 'Security', proficiency: 4, icon: 'security', description: 'API protection and throttling' },
  { name: 'Encryption', category: 'Security', proficiency: 4, icon: 'security', description: 'Data encryption and security' },
  
  // 11. Testing (QA)
  { name: 'Jest', category: 'Testing (QA)', proficiency: 4, icon: 'jest', description: 'JavaScript testing framework' },
  { name: 'Vitest', category: 'Testing (QA)', proficiency: 4, icon: 'vitest', description: 'Fast unit test framework' },
  { name: 'Mocha', category: 'Testing (QA)', proficiency: 3, icon: 'mocha', description: 'JavaScript test framework' },
  { name: 'Cypress', category: 'Testing (QA)', proficiency: 4, icon: 'cypress', description: 'End-to-end testing framework' },
  { name: 'Playwright', category: 'Testing (QA)', proficiency: 3, icon: 'playwright', description: 'End-to-end testing tool' },
  { name: 'Selenium', category: 'Testing (QA)', proficiency: 3, icon: 'selenium', description: 'Web browser automation' },
  
  // 12. Version Control & Collaboration
  { name: 'Git', category: 'Version Control & Collaboration', proficiency: 5, icon: 'git', description: 'Distributed version control system' },
  { name: 'GitHub', category: 'Version Control & Collaboration', proficiency: 5, icon: 'github', description: 'Code hosting and collaboration platform' },
  { name: 'GitLab', category: 'Version Control & Collaboration', proficiency: 4, icon: 'gitlab', description: 'DevOps platform with Git repository management' },
  { name: 'Bitbucket', category: 'Version Control & Collaboration', proficiency: 3, icon: 'bitbucket', description: 'Git repository hosting service' },
  { name: 'GitHub Actions', category: 'Version Control & Collaboration', proficiency: 4, icon: 'github-actions', description: 'CI/CD automation platform' },
  { name: 'GitLab CI/CD', category: 'Version Control & Collaboration', proficiency: 4, icon: 'gitlab', description: 'Continuous integration and deployment' },
  { name: 'Git Flow', category: 'Version Control & Collaboration', proficiency: 4, icon: 'git', description: 'Git branching workflow strategy' },
  { name: 'Pull Requests', category: 'Version Control & Collaboration', proficiency: 5, icon: 'git', description: 'Code review and collaboration workflow' },
  { name: 'Code Review', category: 'Version Control & Collaboration', proficiency: 4, icon: 'git', description: 'Peer code review practices' },
  { name: 'Merge Strategies', category: 'Version Control & Collaboration', proficiency: 4, icon: 'git', description: 'Git merge and rebase strategies' },
  
  // 13. AI & LLM Engineering
  { name: 'OpenAI/LLMs', category: 'AI & LLM Engineering', proficiency: 4, icon: 'ai', description: 'Large language model integration' },
  { name: 'LangChain', category: 'AI & LLM Engineering', proficiency: 3, icon: 'langchain', description: 'LLM application framework' },
  { name: 'Pinecone', category: 'AI & LLM Engineering', proficiency: 3, icon: 'pinecone', description: 'Vector database for AI' },
  { name: 'OpenAI API', category: 'AI & LLM Engineering', proficiency: 4, icon: 'openai', description: 'OpenAI API integration and fine-tuning' },
  { name: 'Anthropic Claude', category: 'AI & LLM Engineering', proficiency: 4, icon: 'claude', description: 'Claude API integration' },
  { name: 'Gemini API', category: 'AI & LLM Engineering', proficiency: 3, icon: 'gemini', description: 'Google Gemini API integration' },
  { name: 'Vector Databases', category: 'AI & LLM Engineering', proficiency: 3, icon: 'vector', description: 'Vector database solutions for embeddings' },
  { name: 'RAG (Retrieval Augmented Generation)', category: 'AI & LLM Engineering', proficiency: 3, icon: 'rag', description: 'RAG architecture and implementation' },
  { name: 'Prompt Engineering', category: 'AI & LLM Engineering', proficiency: 4, icon: 'prompt', description: 'Advanced prompt design and optimization' },
  { name: 'Fine-tuning', category: 'AI & LLM Engineering', proficiency: 3, icon: 'finetune', description: 'LLM fine-tuning and customization' },
  { name: 'Embeddings', category: 'AI & LLM Engineering', proficiency: 3, icon: 'embedding', description: 'Text embeddings and semantic search' },
  { name: 'AI Agents', category: 'AI & LLM Engineering', proficiency: 3, icon: 'agent', description: 'Autonomous AI agent development' },
  
  // 14. Development Environment & AI Workflow
  { name: 'Cursor AI', category: 'Development Environment & AI Workflow', proficiency: 5, icon: 'cursor', description: 'AI-powered code editor' },
  { name: 'Windsurf', category: 'Development Environment & AI Workflow', proficiency: 4, icon: 'windsurf', description: 'AI-enhanced development environment' },
  { name: 'Kiro', category: 'Development Environment & AI Workflow', proficiency: 4, icon: 'kiro', description: 'AI coding assistant' },
  { name: 'ChatGPT', category: 'Development Environment & AI Workflow', proficiency: 5, icon: 'chatgpt', description: 'AI assistant for development' },
  { name: 'Claude Code', category: 'Development Environment & AI Workflow', proficiency: 4, icon: 'claude', description: 'Anthropic Claude for coding' },
  { name: 'Gemini CLI', category: 'Development Environment & AI Workflow', proficiency: 3, icon: 'gemini', description: 'Google Gemini command-line interface' },
  { name: 'VS Code', category: 'Development Environment & AI Workflow', proficiency: 5, icon: 'vscode', description: 'Visual Studio Code editor' },
  { name: 'Sora', category: 'Development Environment & AI Workflow', proficiency: 3, icon: 'sora', description: 'AI video generation tool' },
  { name: 'Google ImageFX', category: 'Development Environment & AI Workflow', proficiency: 3, icon: 'imagefx', description: 'AI image generation tool' },
  { name: 'AI-Assisted Development', category: 'Development Environment & AI Workflow', proficiency: 5, icon: 'ai-dev', description: 'AI-enhanced development workflows' },
  { name: 'Code Generation', category: 'Development Environment & AI Workflow', proficiency: 4, icon: 'codegen', description: 'AI-powered code generation' },
  { name: 'Debugging with AI', category: 'Development Environment & AI Workflow', proficiency: 4, icon: 'ai-debug', description: 'AI-assisted debugging' },
  
  // 15. Specialised
  { name: 'Solidity', category: 'Specialised', proficiency: 2, icon: 'solidity', description: 'Smart contract programming' },
  { name: 'Ethers.js', category: 'Specialised', proficiency: 2, icon: 'ethers', description: 'Ethereum library' },
  { name: 'Three.js', category: 'Specialised', proficiency: 3, icon: 'threejs', description: '3D graphics library' },
  { name: 'WebGL', category: 'Specialised', proficiency: 3, icon: 'webgl', description: '3D graphics API' },
  { name: 'D3.js', category: 'Specialised', proficiency: 3, icon: 'd3', description: 'Data visualization library' },
  { name: 'Recharts', category: 'Specialised', proficiency: 4, icon: 'recharts', description: 'React charting library' }
];

function migrateSkills(clearExisting = false) {
  try {
    // Clear existing skills if requested
    if (clearExisting) {
      console.log('Clearing existing skills...');
      db.prepare('DELETE FROM skills').run();
      console.log('✓ Existing skills cleared');
    }

    // Insert new skills
    console.log(`Inserting ${newSkills.length} skills...`);
    const insertSkill = db.prepare('INSERT INTO skills (name, category, proficiency, icon, description) VALUES (?, ?, ?, ?, ?)');
    
    const transaction = db.transaction((skills) => {
      for (const skill of skills) {
        insertSkill.run(skill.name, skill.category, skill.proficiency, skill.icon, skill.description);
      }
    });
    
    transaction(newSkills);
    
    console.log(`✓ Successfully migrated ${newSkills.length} skills`);
    
    // Show summary by category
    const categoryCounts = db.prepare(`
      SELECT category, COUNT(*) as count 
      FROM skills 
      GROUP BY category 
      ORDER BY category
    `).all();
    
    console.log('\nSkills by category:');
    categoryCounts.forEach(({ category, count }) => {
      console.log(`  ${category}: ${count} skills`);
    });
    
  } catch (error) {
    console.error('Error migrating skills:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const clearExisting = args.includes('--clear');

console.log('Skills Migration Script');
console.log('======================\n');

if (clearExisting) {
  console.log('⚠️  WARNING: This will clear all existing skills!\n');
}

migrateSkills(clearExisting);

