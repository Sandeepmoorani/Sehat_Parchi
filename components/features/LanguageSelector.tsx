import React from 'react';
import { Language } from '@/types';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

const languages: Language[] = ['English', 'Urdu Roman', 'اردو', 'سنڌي'];

export function LanguageSelector({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {languages.map(lang => (
        <button
          key={lang}
          onClick={() => onLanguageChange(lang)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
            selectedLanguage === lang
              ? 'bg-primary text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          )}
          style={{ fontFamily: lang === 'اردو' || lang === 'سنڌي' ? 'var(--font-noto-nastaliq-urdu)' : 'inherit' }}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
