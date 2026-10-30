import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CookieConsent from '@/components/layout/CookieConsent';

export const metadata: Metadata = {
  title: 'PLANOVA — AI-Powered Event Planning Platform',
  description:
    'Every Great Moment Starts with a Plan. Meet PLANOVA, the intelligent generative AI event planner for weddings, birthdays, corporate summits, and cultural fests.',
  keywords: [
    'AI event planner',
    'wedding planning',
    'budget manager',
    'vendor comparison',
    'event schedule',
    'celebration planning',
    'PLANOVA',
  ],
  authors: [{ name: 'PLANOVA Team' }],
  openGraph: {
    title: 'PLANOVA — AI-Powered Event Planning Platform',
    description: 'Transform your celebration vision into an actionable, budgeted, and schedule-perfect reality with AI.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen bg-[#FAFAFF] text-[#17172A] antialiased selection:bg-violet-200 selection:text-indigo-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
