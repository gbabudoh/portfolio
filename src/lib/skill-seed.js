// Canonical skill set. Seeds a fresh database and is loaded into an existing one
// by `npm run migrate:skills:clear`. Plain data with no imports, so the Node
// script can load it directly.
//
// Entries use "Label: item, item" — the About page renders the label as a
// sub-heading and each item as a chip. Proficiency (1–5) orders entries within
// a category and is not shown publicly.

export const SKILL_SEED = [
  { name: 'Frameworks: Next.js (App Router), React, Vite', category: 'Frontend', proficiency: 5 },
  { name: 'PWAs: installable, offline-ready web apps', category: 'Frontend', proficiency: 4 },

  { name: 'Tailwind CSS, ShadCN, Framer Motion', category: 'Styling', proficiency: 4 },

  { name: 'TypeScript / JavaScript, Python', category: 'Languages', proficiency: 5 },

  { name: 'Node.js, FastAPI (Python), Next.js API Routes & Server Actions', category: 'Backend', proficiency: 5 },
  { name: 'Payments: Stripe (Checkout, Webhooks, Connect), Paystack', category: 'Backend', proficiency: 5 },

  { name: 'PostgreSQL, MySQL, SQLite', category: 'Database', proficiency: 4 },
  { name: 'ORMs: Prisma, Drizzle', category: 'Database', proficiency: 5 },

  { name: 'REST APIs, Webhooks, Third-party integrations (Google OAuth, Google Ads API)', category: 'APIs & Communication', proficiency: 4 },
  { name: 'Real-time: LiveKit (WebRTC video), WebSockets', category: 'APIs & Communication', proficiency: 4 },

  { name: 'Linux VPS: Ubuntu, Rocky Linux, CloudPanel, systemd', category: 'Infrastructure (DevOps)', proficiency: 5 },
  { name: "Web servers & SSL: Nginx, Apache, Let's Encrypt, DNS", category: 'Infrastructure (DevOps)', proficiency: 5 },
  { name: 'Docker Compose, GitHub-based deploy pipelines', category: 'Infrastructure (DevOps)', proficiency: 4 },
  { name: 'Self-hosted email: Postfix, Dovecot, Roundcube', category: 'Infrastructure (DevOps)', proficiency: 4 },

  { name: 'Auth: OAuth 2.0, JWT, NextAuth; HTTPS, CORS, rate limiting', category: 'Security', proficiency: 4 },

  { name: 'LLM integration: OpenAI, Anthropic Claude', category: 'AI & LLM Engineering', proficiency: 4 },
  { name: 'Automation: n8n workflows', category: 'AI & LLM Engineering', proficiency: 4 },

  { name: 'AI-native development: Claude Code, Cursor', category: 'Development Environment & AI Workflow', proficiency: 5 },

  { name: 'Core Web Vitals, SSR/SSG/ISR, structured data, sitemaps, OG images', category: 'Performance & SEO Optimization', proficiency: 4 },

  { name: 'Marketplaces & SaaS: multi-vendor, subscriptions, admin dashboards', category: 'Specialised', proficiency: 5 },

  { name: 'Git & GitHub', category: 'Version Control & Collaboration', proficiency: 5 },
];
