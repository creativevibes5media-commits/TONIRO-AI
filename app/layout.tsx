import type {Metadata} from 'next';
import './globals.css';
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'Toniro AI - Perfect Tone',
  description: 'AI-powered SaaS web application for automatic photo color correction.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={cn("font-sans dark", inter.variable)}>
      <body className="bg-brand-bg text-brand-text-main selection:bg-brand-primary/30" suppressHydrationWarning>
        {children}
        <Toaster theme="dark" />
      </body>
    </html>
  );
}
