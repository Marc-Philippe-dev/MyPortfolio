import type { Metadata } from 'next'
import './globals.css'

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
      <body className="antialiased">{children}</body>
    </html>
  )
}

