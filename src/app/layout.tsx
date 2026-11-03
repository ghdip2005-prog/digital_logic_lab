import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlobalSearchModal from '@/components/layout/GlobalSearchModal';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Digital Logic Lab — Learn Logic. Build Circuits. Understand Digital Systems.',
  description: 'Interactive educational platform and virtual laboratory for Digital Logic Design (DLD). Features dynamic truth tables, interactive logic circuit simulator, K-Map solver, number base converter, verified IC library, and physical breadboard laboratory experiments.',
  keywords: ['Digital Logic Design', 'Boolean Algebra', 'Logic Gates', 'K-Map Solver', 'Circuit Simulator', 'TTL IC', 'Breadboard Lab', 'Full Adder', '7408', '7400', 'Flip Flop']
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        <AppProvider>
          <Navbar />
          <GlobalSearchModal />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
