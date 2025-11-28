'use client'

import { useI18n } from '@/contexts/I18nContext'
import { ReactNode } from 'react'

export default function I18nWrapper({ children }: { children: ReactNode }) {
  const { isLoading } = useI18n()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="animate-pulse text-mint">Loading...</div>
      </div>
    )
  }

  return <>{children}</>
}

