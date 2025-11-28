import type { Metadata } from 'next'
import './globals.css'
import { I18nProvider } from '@/contexts/I18nContext'
import I18nWrapper from '@/components/I18nWrapper'

export const metadata: Metadata = {
  title: 'Marc Philippe - Data Engineer & Analyst',
  description: 'Portfolio of Marc Philippe GNANCADJA - Data Engineer and Data Analyst',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <I18nProvider>
          <I18nWrapper>{children}</I18nWrapper>
        </I18nProvider>
      </body>
    </html>
  )
}

