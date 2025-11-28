'use client'

import { useI18n } from '@/contexts/I18nContext'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n()

  return (
    <div className="flex items-center gap-2 border border-slate-700 rounded-lg p-1 bg-slate">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
          language === 'en'
            ? 'bg-mint text-navy'
            : 'text-slate-muted hover:text-mint'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('fr')}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
          language === 'fr'
            ? 'bg-mint text-navy'
            : 'text-slate-muted hover:text-mint'
        }`}
      >
        FR
      </button>
    </div>
  )
}

