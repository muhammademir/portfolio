import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/shared/Providers'
import { Toaster } from 'react-hot-toast'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Muhammad Emir Fadlyanto — Fullstack Developer',
  description: 'Portfolio of Muhammad Emir Fadlyanto, Fullstack Developer & IoT Enthusiast based in Bandung.',
  openGraph: {
    title: 'Muhammad Emir Fadlyanto — Fullstack Developer',
    description: 'Fullstack Developer & IoT Enthusiast based in Bandung.',
    url: '',
    siteName: 'Muhammad Emir Fadlyanto',
    locale: 'id_ID',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={cn("font-sans", geist.variable)}>
      <body>
        <Providers>
          {children}
          <Toaster position="bottom-right" toastOptions={{ style: { fontSize: '13px' } }} />
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  )
}
