import type { Metadata } from 'next';
import { Inter, Noto_Nastaliq_Urdu } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-noto-nastaliq-urdu',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sehat Parchi - Lab Report Samjhao',
  description: 'Understand your lab reports in easy language - English, Urdu, and Sindhi.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${notoNastaliqUrdu.variable} font-sans antialiased bg-gray-50 text-slate-900 min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
