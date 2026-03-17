import type {Metadata} from 'next';
import { Space_Grotesk, Henny_Penny, Creepster } from 'next/font/google';
import './globals.css';
import { PrivyProvider } from '@/components/PrivyProvider';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
});

const hennyPenny = Henny_Penny({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
});

const creepster = Creepster({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-creepster',
});

export const metadata: Metadata = {
  title: 'Opensperm',
  description: 'Private AI on dedicated GPU.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${hennyPenny.variable} ${creepster.variable} font-sans antialiased`} suppressHydrationWarning>
        <PrivyProvider>{children}</PrivyProvider>
      </body>
    </html>
  );
}
