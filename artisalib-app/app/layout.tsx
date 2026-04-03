import './globals.css';
import type { Metadata } from 'next';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import { getCurrentUser } from '@/lib/auth';
import { Header } from '@/components/header';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Artisalib',
  description: 'Plateforme de mise en relation entre artisans du bâtiment et particuliers.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="fr" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="font-sans text-ink antialiased">
        <Header user={user} />
        {children}
      </body>
    </html>
  );
}
