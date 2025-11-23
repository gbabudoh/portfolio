import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import AnalyticsScript from '@/components/AnalyticsScript';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'Godwin - AI-Enhanced Full-Stack Developer & Solution Architect',
    template: '%s | Godwin Portfolio'
  },
  description: 'Professional portfolio showcasing full-stack development, mobile apps, e-commerce solutions, and AI-enhanced development workflows. 4+ years experience in React.js, Vue.js, Next.js, Node.js, and modern web technologies.',
  keywords: [
    'full-stack developer',
    'web developer',
    'React.js developer',
    'Vue.js developer',
    'Next.js developer',
    'Node.js developer',
    'mobile app developer',
    'e-commerce developer',
    'AI-enhanced development',
    'solution architect',
    'portfolio',
    'freelance developer',
    'JavaScript developer',
    'TypeScript developer',
    'React Native developer'
  ],
  authors: [{ name: 'Godwin', url: 'https://godwinportfolio.com' }],
  creator: 'Godwin',
  publisher: 'Godwin Portfolio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://godwinportfolio.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://godwinportfolio.com',
    title: 'Godwin - AI-Enhanced Full-Stack Developer & Solution Architect',
    description: 'Professional portfolio showcasing full-stack development, mobile apps, e-commerce solutions, and AI-enhanced development workflows.',
    siteName: 'Godwin Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Godwin - Full-Stack Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Godwin - AI-Enhanced Full-Stack Developer & Solution Architect',
    description: 'Professional portfolio showcasing full-stack development, mobile apps, e-commerce solutions, and AI-enhanced development workflows.',
    images: ['/og-image.png'],
    creator: '@godwin_dev',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon.png', type: 'image/png', sizes: '16x16' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Godwin",
    "jobTitle": "AI-Enhanced Full-Stack Developer & Solution Architect",
    "description": "Professional full-stack developer with 4+ years experience in React.js, Vue.js, Next.js, Node.js, and modern web technologies. Specializes in AI-enhanced development workflows.",
    "url": "https://godwinportfolio.com",
    "sameAs": [
      "https://github.com/godwin",
      "https://linkedin.com/in/godwin",
      "https://twitter.com/godwin_dev"
    ],
    "knowsAbout": [
      "React.js",
      "Vue.js", 
      "Next.js",
      "Node.js",
      "JavaScript",
      "TypeScript",
      "React Native",
      "Mobile App Development",
      "E-commerce Development",
      "AI-Enhanced Development",
      "Full-Stack Development",
      "Web Development"
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Full-Stack Developer",
      "occupationLocation": {
        "@type": "Place",
        "name": "Remote"
      }
    },
    "alumniOf": {
      "@type": "Organization",
      "name": "Self-Taught Developer"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
        <link rel="icon" href="/favicon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <AnalyticsScript />
      </body>
    </html>
  );
}
