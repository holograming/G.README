import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/lib/i18n/language-context'
import { LanguageSelector } from '@/components/language-selector'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'README Generator',
  description: 'Generate README with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <LanguageSelector />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}