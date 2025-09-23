import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path - store in project root
const dbPath = path.join(process.cwd(), 'portfolio.db');

let db;

export function getDatabase() {
  if (!db) {
    db = new Database(dbPath);
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON');
    
    // Create tables if they don't exist
    createTables();
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
      live_url TEXT,
      github_url TEXT,
      technologies TEXT,
      category TEXT NOT NULL,
      featured BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

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

  // Insert sample data if tables are empty
  insertSampleData();
}

function insertSampleData() {
  const db = getDatabase();
  
  // Check if skills table has data
  const skillCount = db.prepare('SELECT COUNT(*) as count FROM skills').get();
  if (skillCount.count === 0) {
    const skills = [
      // Languages
      { name: 'JavaScript', category: 'Languages', proficiency: 5, icon: 'javascript', description: 'Core programming language for web development' },
      { name: 'TypeScript', category: 'Languages', proficiency: 4, icon: 'typescript', description: 'Typed superset of JavaScript' },
      { name: 'PHP', category: 'Languages', proficiency: 5, icon: 'php', description: 'Server-side scripting language' },
      { name: 'Python', category: 'Languages', proficiency: 3, icon: 'python', description: 'Versatile programming language' },
      { name: 'HTML5', category: 'Languages', proficiency: 5, icon: 'html', description: 'Markup language for web structure' },
      { name: 'CSS3', category: 'Languages', proficiency: 5, icon: 'css', description: 'Styling language for web design' },
      
      // Frontend
      { name: 'React.js', category: 'Frontend', proficiency: 5, icon: 'react', description: 'Modern React with hooks and context' },
      { name: 'Next.js', category: 'Frontend', proficiency: 5, icon: 'nextjs', description: 'Full-stack React framework' },
      { name: 'Vue.js', category: 'Frontend', proficiency: 4, icon: 'vue', description: 'Progressive JavaScript framework' },
      { name: 'Nuxt.js', category: 'Frontend', proficiency: 3, icon: 'nuxt', description: 'Vue.js meta-framework' },
      
      // Backend
      { name: 'Node.js', category: 'Backend', proficiency: 5, icon: 'nodejs', description: 'Server-side JavaScript runtime' },
      { name: 'Express.js', category: 'Backend', proficiency: 4, icon: 'express', description: 'Web application framework for Node.js' },
      
      // Database
      { name: 'MySQL', category: 'Database', proficiency: 5, icon: 'database', description: 'Relational database management' },
      { name: 'SQLite', category: 'Database', proficiency: 5, icon: 'database', description: 'Lightweight database engine' },
      { name: 'MongoDB', category: 'Database', proficiency: 3, icon: 'database', description: 'NoSQL document database' },
      
      // Mobile
      { name: 'React Native', category: 'Mobile', proficiency: 4, icon: 'mobile', description: 'Cross-platform mobile development' },
      { name: 'Expo', category: 'Mobile', proficiency: 4, icon: 'mobile', description: 'React Native development platform' },
      
      // Styling
      { name: 'Tailwind CSS', category: 'Styling', proficiency: 5, icon: 'css', description: 'Utility-first CSS framework' },
      { name: 'Chakra UI', category: 'Styling', proficiency: 4, icon: 'css', description: 'Simple and modular component library' },
      { name: 'Ant Design', category: 'Styling', proficiency: 3, icon: 'css', description: 'Enterprise-class UI design language' },
      
      // Specialized
      { name: 'AI Integration', category: 'Specialized', proficiency: 5, icon: 'ai', description: 'AI-powered development tools' },
      { name: 'DevOps', category: 'Specialized', proficiency: 4, icon: 'devops', description: 'Development and operations practices' },
      { name: 'Agile Methodology', category: 'Specialized', proficiency: 4, icon: 'agile', description: 'Iterative development approach' }
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
        live_url: 'https://gmuuk.org',
        github_url: '',
        technologies: 'Vue.js, PHP, SQLite, Custom Admin Panel',
        category: 'Community Platform',
        featured: true
      },
      {
        title: 'Egobas Business Consultancy',
        description: 'Enterprise business platform with complete infrastructure',
        long_description: 'Migrated from WordPress to React.js with headless WordPress backend, integrated ProjectSend CRM, and set up complete server infrastructure from scratch including VPS, Virtualmin, Ubuntu, email systems, and security.',
        image_url: '/api/placeholder/600/400',
        live_url: 'https://egobas.com',
        github_url: '',
        technologies: 'React.js, Headless WordPress, MySQL, VPS Infrastructure',
        category: 'Business Platform',
        featured: true
      },
      {
        title: 'Niger Delta Consortium',
        description: 'Cost-effective business solution with AI-generated content',
        long_description: 'Built business consortium platform using React.js, WordPress, and Pure CSS. Integrated Google Analytics and Matomo analytics, implemented SEO structure, and used AI tools for content generation.',
        image_url: '/api/placeholder/600/400',
        live_url: 'https://nigerdeltaconsortium.com',
        github_url: '',
        technologies: 'React.js, WordPress, MySQL, Pure CSS, Analytics',
        category: 'Business Platform',
        featured: false
      },
      {
        title: 'Block Breaker Mobile Game',
        description: 'Cross-platform mobile game using React Native',
        long_description: 'Developed engaging mobile game using React Native and Expo. Features real-time physics, collision detection, and cross-platform compatibility. Ready for app store deployment.',
        image_url: '/api/placeholder/600/400',
        live_url: 'https://download-blockbreaker.netlify.app/',
        github_url: '',
        technologies: 'React Native, Expo, Game Physics, Cross-platform',
        category: 'Mobile App',
        featured: false
      },
      {
        title: 'MyCheckout E-commerce',
        description: 'Next.js e-commerce platform with Stripe integration',
        long_description: 'Built complete e-commerce solution using Next.js with Stripe payment processing. Features shopping cart, secure checkout, and responsive design for tech products.',
        image_url: '/api/placeholder/600/400',
        live_url: 'https://mycheckout.netlify.app/',
        github_url: '',
        technologies: 'Next.js, Stripe, E-commerce, Responsive Design',
        category: 'E-commerce',
        featured: false
      },
      {
        title: 'GlowUp Shop Affiliate Platform',
        description: 'Custom affiliate marketing platform for beauty products',
        long_description: 'Built specialized affiliate e-commerce platform allowing clients to manage product listings, upload images, and integrate affiliate links. Custom admin system for non-technical users.',
        image_url: '/api/placeholder/600/400',
        live_url: 'https://glowupshop.netlify.app/',
        github_url: '',
        technologies: 'Next.js, Affiliate Marketing, Custom Admin, Stripe',
        category: 'Affiliate Platform',
        featured: false
      }
    ];

    const insertProject = db.prepare('INSERT INTO projects (title, description, long_description, image_url, live_url, github_url, technologies, category, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    projects.forEach(project => insertProject.run(project.title, project.description, project.long_description, project.image_url, project.live_url, project.github_url, project.technologies, project.category, project.featured ? 1 : 0));
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

  // Check if about_content table has data
  const aboutCount = db.prepare('SELECT COUNT(*) as count FROM about_content').get();
  if (aboutCount.count === 0) {
    const aboutSections = [
      {
        section: 'main_description',
        title: 'About Me',
        content: "I'm a passionate full-stack developer and solution architect who combines technical expertise with AI-enhanced workflows to deliver exceptional results."
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
