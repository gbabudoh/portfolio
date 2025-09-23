# Godwin's Portfolio - AI-Enhanced Full-Stack Developer

A modern, responsive portfolio website built with Next.js 15, SQLite database, and comprehensive admin panel. This portfolio showcases full-stack development skills, mobile app development, e-commerce solutions, and AI-enhanced development workflows.

## 🚀 Features

### Security & Authentication
- **Admin Authentication**: Secure login system with session management
- **Protected Routes**: All admin routes require authentication
- **Session Management**: Secure HTTP-only cookies with expiration
- **Security Headers**: XSS protection, CSRF prevention, and content security policies
- **Rate Limiting**: Basic rate limiting for admin endpoints
- **Environment Variables**: Secure credential management

### Frontend
- **Modern Design**: Beautiful gradient backgrounds and smooth animations
- **Responsive Layout**: Mobile-first design that works on all devices
- **Dark/Light Mode**: Toggle between themes with persistent preferences
- **Smooth Scrolling**: Seamless navigation between sections
- **Framer Motion**: Engaging animations and transitions

### Backend
- **SQLite Database**: Lightweight, file-based database for easy deployment
- **RESTful APIs**: Clean API endpoints for all portfolio data
- **CRUD Operations**: Full Create, Read, Update, Delete functionality
- **Data Validation**: Input validation and error handling

### Admin Panel
- **Dashboard**: Overview of portfolio statistics and recent activity
- **Skills Management**: Add, edit, and delete technical skills with proficiency levels
- **Projects Management**: Manage portfolio projects with categories and featured status
- **Experience Management**: Track work experience and achievements
- **Contact Messages**: View and manage contact form submissions
- **Settings**: Configure portfolio preferences and site information

### Portfolio Sections
- **Hero Section**: Eye-catching introduction with animated elements
- **About**: Professional background and key features
- **Skills**: Technical skills organized by category with proficiency indicators
- **Projects**: Showcase of work with filtering and detailed views
- **Contact**: Contact form with database storage
- **Footer**: Social links and additional information

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes, SQLite3
- **Database**: SQLite with better-sqlite3
- **Styling**: Tailwind CSS with custom components
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Theme**: Custom light/dark mode implementation

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── skills/            # Skills CRUD operations
│   │   ├── projects/          # Projects CRUD operations
│   │   ├── experience/        # Experience CRUD operations
│   │   └── contact/           # Contact form handling
│   ├── admin/                 # Admin panel pages
│   │   ├── skills/            # Skills management
│   │   ├── projects/          # Projects management
│   │   ├── experience/        # Experience management
│   │   ├── messages/          # Contact messages
│   │   └── settings/          # Site settings
│   ├── globals.css            # Global styles
│   ├── layout.js              # Root layout
│   └── page.js                # Main portfolio page
├── components/                 # Reusable components
│   ├── admin/                 # Admin-specific components
│   │   └── AdminNavigation.js # Admin navigation
│   ├── Hero.js                # Hero section
│   ├── About.js               # About section
│   ├── Skills.js              # Skills section
│   ├── Projects.js            # Projects section
│   ├── Contact.js             # Contact section
│   ├── Footer.js              # Footer component
│   ├── Navigation.js          # Main navigation
│   └── ThemeProvider.js       # Theme context provider
└── lib/
    └── database.js            # Database utilities and schema
```

## 🗄️ Database Schema

### Skills Table
- `id`: Primary key
- `name`: Skill name
- `category`: Skill category (Frontend, Backend, Database, etc.)
- `proficiency`: Proficiency level (1-5)
- `icon`: Icon identifier
- `description`: Skill description
- `created_at`: Creation timestamp

### Projects Table
- `id`: Primary key
- `title`: Project title
- `description`: Short description
- `long_description`: Detailed description
- `image_url`: Project image URL
- `live_url`: Live project URL
- `github_url`: GitHub repository URL
- `technologies`: Technologies used
- `category`: Project category
- `featured`: Featured project flag
- `created_at`: Creation timestamp

### Experience Table
- `id`: Primary key
- `company`: Company name
- `position`: Job position
- `description`: Role description
- `start_date`: Start date
- `end_date`: End date
- `current`: Current position flag
- `technologies`: Technologies used
- `achievements`: Key achievements
- `created_at`: Creation timestamp

### Contact Messages Table
- `id`: Primary key
- `name`: Contact person name
- `email`: Contact email
- `subject`: Message subject
- `message`: Message content
- `read`: Read status flag
- `created_at`: Creation timestamp

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Admin Access

Access the admin panel at `/admin/login` to manage:
- Skills and proficiency levels
- Portfolio projects
- Work experience
- Contact messages
- Site settings

**Security Setup:**
1. Copy `env.example` to `.env.local`
2. Set your desired admin credentials:
   ```bash
   ADMIN_USERNAME=your_username
   ADMIN_PASSWORD=your_secure_password
   ```
3. Default credentials (if no .env.local): `admin` / `portfolio2024!`

**Security Features:**
- All admin routes are protected with authentication
- Session-based security with HTTP-only cookies
- Automatic logout after 24 hours
- Rate limiting and security headers

## 📱 Portfolio Content

This portfolio showcases:

### Featured Projects
1. **GMUUK Community Platform** - Vue.js + PHP + SQLite with custom admin panel
2. **Egobas Business Consultancy** - React.js + Headless WordPress + complete infrastructure
3. **Niger Delta Consortium** - Cost-effective business solution with AI-generated content
4. **Block Breaker Mobile Game** - React Native cross-platform mobile game
5. **MyCheckout E-commerce** - Next.js e-commerce with Stripe integration
6. **GlowUp Shop Affiliate Platform** - Custom affiliate marketing system

### Technical Skills
- **Frontend**: React.js, Next.js, Vue.js, Tailwind CSS
- **Backend**: Node.js, PHP, Express.js
- **Database**: MySQL, SQLite, MongoDB
- **Mobile**: React Native, Expo
- **AI Integration**: Cursor, Windsurf, Kiro, ChatGPT, Sora, Google ImageFX
- **DevOps**: VPS setup, server management, deployment

## 🎨 Customization

### Colors and Themes
- Modify `tailwind.config.js` for color schemes
- Update `ThemeProvider.js` for theme logic
- Customize gradients in component files

### Content Management
- Use the admin panel to update all portfolio content
- Modify sample data in `database.js`
- Update project information and skills

### Styling
- Edit `globals.css` for global styles
- Modify component-specific styles
- Update Tailwind classes for layout changes

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms
- **Netlify**: Build and deploy from Git
- **Railway**: Full-stack deployment with database
- **Digital Ocean**: VPS deployment with custom domain

### Database Considerations
- SQLite file will be created automatically
- For production, consider migrating to PostgreSQL or MySQL
- Update database connection in `database.js`

## 🔧 Development

### Adding New Sections
1. Create new component in `components/`
2. Add to main page in `app/page.js`
3. Update navigation if needed
4. Add any required API routes

### Security Best Practices
1. **Environment Variables**: Never commit sensitive data to version control
2. **Input Validation**: Always validate user input in API routes
3. **Session Management**: Use secure, HTTP-only cookies for sessions
4. **Rate Limiting**: Implement rate limiting for sensitive endpoints
5. **Security Headers**: Keep security headers updated in middleware
6. **Password Security**: Use strong, unique passwords for admin access

### Database Changes
1. Modify schema in `database.js`
2. Update API routes
3. Modify admin components
4. Test CRUD operations

### Styling Updates
1. Use Tailwind CSS classes
2. Add custom CSS in `globals.css`
3. Create reusable component classes
4. Maintain responsive design

## 📊 Performance Features

- **Image Optimization**: Next.js built-in image optimization
- **Code Splitting**: Automatic code splitting for better performance
- **Lazy Loading**: Components load as needed
- **Optimized Animations**: Smooth 60fps animations
- **Responsive Images**: Optimized for different screen sizes

## 🔒 Security Features

- **SQL Injection Prevention**: Prepared statements with better-sqlite3
- **Input Validation**: Form validation and sanitization
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: Next.js built-in CSRF protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

- **Portfolio**: [Your Portfolio URL]
- **Email**: contact@godwin.dev
- **LinkedIn**: [Your LinkedIn]
- **GitHub**: [Your GitHub]

## 🙏 Acknowledgments

- Built with Next.js and Tailwind CSS
- Icons from Lucide React
- Animations powered by Framer Motion
- Database management with SQLite

---

**Built with ❤️ using AI-enhanced development workflows**
