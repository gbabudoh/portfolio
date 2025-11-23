import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path - use env override, fallback to project root sqlite file
const dbPath = process.env.DATABASE_URL
  ? path.isAbsolute(process.env.DATABASE_URL)
    ? process.env.DATABASE_URL
    : path.join(process.cwd(), process.env.DATABASE_URL)
  : path.join(process.cwd(), 'portfolio.db');

let db;

export function getDatabase() {
  if (!db) {
    try {
      db = new Database(dbPath);
      
      // Enable foreign keys
      db.pragma('foreign_keys = ON');
      
      // Create tables if they don't exist
      createTables();
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }
  return db;
}

function createTables() {
  // Skills table
  db.exec(`
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      proficiency INTEGER DEFAULT 3,
      icon TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Projects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      long_description TEXT,
      image_url TEXT,
      image_public_id TEXT,
      live_url TEXT,
      github_url TEXT,
      technologies TEXT,
      technical_skills TEXT,
      category TEXT NOT NULL,
      featured BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Add technical_skills column if it doesn't exist (for existing databases)
  try {
    db.exec('ALTER TABLE projects ADD COLUMN technical_skills TEXT');
  } catch (e) {
    // Column already exists, ignore error
  }

  // Work experience table
  db.exec(`
    CREATE TABLE IF NOT EXISTS experience (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      position TEXT NOT NULL,
      description TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT,
      current BOOLEAN DEFAULT FALSE,
      technologies TEXT,
      achievements TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Contact messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      read BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // About content table
  db.exec(`
    CREATE TABLE IF NOT EXISTS about_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section TEXT NOT NULL UNIQUE,
      title TEXT,
      content TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Analytics tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS page_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_path TEXT NOT NULL,
      visitor_id TEXT NOT NULL,
      session_id TEXT NOT NULL,
      user_agent TEXT,
      referrer TEXT,
      ip_address TEXT,
      country TEXT,
      city TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS visitors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      visitor_id TEXT UNIQUE NOT NULL,
      first_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
      total_visits INTEGER DEFAULT 1,
      total_page_views INTEGER DEFAULT 1,
      country TEXT,
      city TEXT,
      device_type TEXT,
      browser TEXT,
      os TEXT
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS engagement_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      visitor_id TEXT NOT NULL,
      session_id TEXT NOT NULL,
      page_path TEXT NOT NULL,
      time_on_page INTEGER DEFAULT 0,
      scroll_depth REAL DEFAULT 0,
      interactions INTEGER DEFAULT 0,
      exit_page BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Stats table
  db.exec(`
    CREATE TABLE IF NOT EXISTS stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL UNIQUE,
      value TEXT NOT NULL,
      label TEXT NOT NULL,
      color TEXT DEFAULT 'blue',
      display_order INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert sample data only in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    insertSampleData();
  }
}

function insertSampleData() {
  const db = getDatabase();
  
  // Check if skills table has data
  const skillCount = db.prepare('SELECT COUNT(*) as count FROM skills').get();
  if (skillCount.count === 0) {
    const skills = [
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

    const insertSkill = db.prepare('INSERT INTO skills (name, category, proficiency, icon, description) VALUES (?, ?, ?, ?, ?)');
    skills.forEach(skill => insertSkill.run(skill.name, skill.category, skill.proficiency, skill.icon, skill.description));
  }

  // Check if projects table has data
  const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get();
  if (projectCount.count === 0) {
    const projects = [
      {
        title: 'GMUUK Community Platform',
        description: 'Community organization website with custom admin panel',
        long_description: 'Built a comprehensive community platform for Ghanaian Muslim Union UK using Vue.js frontend, PHP backend, and SQLite database. Features include custom admin panel for content management, event management, and team profiles.',
        image_url: '/api/placeholder/600/400',
        image_public_id: 'portfolio/projects/gmuuk-community',
        live_url: 'https://gmuuk.org',
        github_url: '',
        technologies: 'Vue.js, PHP, SQLite, Custom Admin Panel',
        category: 'Marketing & Content Platforms',
        featured: true
      },
      {
        title: 'Egobas Business Consultancy',
        description: 'Enterprise business platform with complete infrastructure',
        long_description: 'Migrated from WordPress to React.js with headless WordPress backend, integrated ProjectSend CRM, and set up complete server infrastructure from scratch including VPS, Virtualmin, Ubuntu, email systems, and security.',
        image_url: '/api/placeholder/600/400',
        image_public_id: 'portfolio/projects/egobas-business',
        live_url: 'https://egobas.com',
        github_url: '',
        technologies: 'React.js, Headless WordPress, MySQL, VPS Infrastructure',
        category: 'SaaS & Productivity',
        featured: true
      },
      {
        title: 'Niger Delta Consortium',
        description: 'Cost-effective business solution with AI-generated content',
        long_description: 'Built business consortium platform using React.js, WordPress, and Pure CSS. Integrated Google Analytics and Matomo analytics, implemented SEO structure, and used AI tools for content generation.',
        image_url: '/api/placeholder/600/400',
        image_public_id: 'portfolio/projects/niger-delta-consortium',
        live_url: 'https://nigerdeltaconsortium.com',
        github_url: '',
        technologies: 'React.js, WordPress, MySQL, Pure CSS, Analytics',
        category: 'Marketing & Content Platforms',
        featured: false
      },
      {
        title: 'Block Breaker Mobile Game',
        description: 'Cross-platform mobile game using React Native',
        long_description: 'Developed engaging mobile game using React Native and Expo. Features real-time physics, collision detection, and cross-platform compatibility. Ready for app store deployment.',
        image_url: '/api/placeholder/600/400',
        image_public_id: 'portfolio/projects/block-breaker-game',
        live_url: 'https://download-blockbreaker.netlify.app/',
        github_url: '',
        technologies: 'React Native, Expo, Game Physics, Cross-platform',
        category: 'Mobile Applications',
        featured: false
      },
      {
        title: 'MyCheckout E-commerce',
        description: 'Next.js e-commerce platform with Stripe integration',
        long_description: 'Built complete e-commerce solution using Next.js with Stripe payment processing. Features shopping cart, secure checkout, and responsive design for tech products.',
        image_url: '/api/placeholder/600/400',
        image_public_id: 'portfolio/projects/mycheckout-ecommerce',
        live_url: 'https://mycheckout.netlify.app/',
        github_url: '',
        technologies: 'Next.js, Stripe, E-commerce, Responsive Design',
        category: 'Commerce & Marketplaces',
        featured: false
      },
      {
        title: 'GlowUp Shop Affiliate Platform',
        description: 'Custom affiliate marketing platform for beauty products',
        long_description: 'Built specialised affiliate e-commerce platform allowing clients to manage product listings, upload images, and integrate affiliate links. Custom admin system for non-technical users.',
        image_url: '/api/placeholder/600/400',
        image_public_id: 'portfolio/projects/glowup-shop',
        live_url: 'https://glowupshop.netlify.app/',
        github_url: '',
        technologies: 'Next.js, Affiliate Marketing, Custom Admin, Stripe',
        category: 'Commerce & Marketplaces',
        featured: false
      }
    ];

    const insertProject = db.prepare('INSERT INTO projects (title, description, long_description, image_url, image_public_id, live_url, github_url, technologies, category, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    projects.forEach(project => insertProject.run(project.title, project.description, project.long_description, project.image_url, project.image_public_id || '', project.live_url, project.github_url, project.technologies, project.category, project.featured ? 1 : 0));
  }

  // Check if experience table has data
  const expCount = db.prepare('SELECT COUNT(*) as count FROM experience').get();
  if (expCount.count === 0) {
    const experiences = [
      {
        company: 'Freelance Developer',
        position: 'Full-Stack Developer & Solution Architect',
        description: 'Delivering comprehensive web and mobile solutions for diverse clients',
        start_date: '2020-01',
        end_date: null,
        current: true,
        technologies: 'React.js, Vue.js, Next.js, PHP, Node.js, React Native',
        achievements: 'Built 6+ production websites, mobile apps, and e-commerce platforms'
      },
      {
        company: 'AI-Enhanced Development',
        position: 'AI Integration Specialist',
        description: 'Leveraging AI tools for faster, higher-quality development',
        start_date: '2023-01',
        end_date: null,
        current: true,
        technologies: 'Cursor, Windsurf, Kiro, ChatGPT, Sora, Google ImageFX',
        achievements: '40-60% faster project delivery through AI-assisted development'
      }
    ];

    const insertExp = db.prepare('INSERT INTO experience (company, position, description, start_date, end_date, current, technologies, achievements) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    experiences.forEach(exp => insertExp.run(exp.company, exp.position, exp.description, exp.start_date, exp.end_date, exp.current ? 1 : 0, exp.technologies, exp.achievements));
  }

  // Check if stats table has data
  const statsCount = db.prepare('SELECT COUNT(*) as count FROM stats').get();
  if (statsCount.count === 0) {
    const stats = [
      { key: 'production_projects', value: '7+', label: 'Production Projects', color: 'blue', display_order: 1 },
      { key: 'years_experience', value: '4+', label: 'Years Experience', color: 'purple', display_order: 2 },
      { key: 'faster_delivery', value: '40-60%', label: 'Faster Delivery', color: 'green', display_order: 3 },
      { key: 'client_satisfaction', value: '100%', label: 'Client Satisfaction', color: 'orange', display_order: 4 }
    ];

    const insertStat = db.prepare('INSERT INTO stats (key, value, label, color, display_order) VALUES (?, ?, ?, ?, ?)');
    stats.forEach(stat => insertStat.run(stat.key, stat.value, stat.label, stat.color, stat.display_order));
  }

  // Check if about_content table has data
  const aboutCount = db.prepare('SELECT COUNT(*) as count FROM about_content').get();
  if (aboutCount.count === 0) {
    const aboutSections = [
      {
        section: 'main_description',
        title: 'About Me',
        content: "Full Stack Engineer leveraging intelligent automation to build robust Web, Mobile, and Commerce ecosystems faster and more reliably."
      },
      {
        section: 'experience_paragraph',
        title: 'Experience',
        content: "With over 4 years of experience in full-stack development, I've built a reputation for delivering comprehensive solutions that go beyond just websites. My expertise spans from community platforms to enterprise business solutions, mobile applications, and e-commerce platforms."
      },
      {
        section: 'ai_integration',
        title: 'AI Integration',
        content: "What sets me apart is my integration of AI-powered development tools, including Cursor, Windsurf, Kiro, ChatGPT, Sora, and Google ImageFX. This approach enables me to deliver projects 40-60% faster while maintaining the highest quality standards."
      },
      {
        section: 'specialization',
        title: 'Specialization',
        content: "I specialize in understanding business requirements and architecting solutions that not only meet technical needs but also drive business growth. From simple community websites to complex enterprise systems, I ensure every project is built with scalability, performance, and user experience in mind."
      }
    ];

    const insertAbout = db.prepare('INSERT INTO about_content (section, title, content) VALUES (?, ?, ?)');
    aboutSections.forEach(section => insertAbout.run(section.section, section.title, section.content));
  }
}

export function closeDatabase() {
  if (db) {
    db.close();
  }
}
