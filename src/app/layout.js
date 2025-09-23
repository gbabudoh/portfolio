import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import AnalyticsScript from '@/components/AnalyticsScript';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Godwin - AI-Enhanced Full-Stack Developer & Solution Architect',
  description: 'Professional portfolio showcasing full-stack development, mobile apps, e-commerce solutions, and AI-enhanced development workflows.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <AnalyticsScript />
      </body>
    </html>
  );
}
