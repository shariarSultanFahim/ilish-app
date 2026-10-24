import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { en, TranslationKeys } from './en';
import { bn } from './bn';

export type Language = 'en' | 'bn';

interface I18nContextType {
  lang: Language;
  t: TranslationKeys;
  toggleLanguage: () => Promise<void>;
  format: (template: string, values: Record<string, string | number>) => string;
  getSpeciesName: (key: string) => string;
}

const STORAGE_KEY = '@ilish_checker_language';

const translations: Record<Language, TranslationKeys> = {
  en,
  bn,
};

const I18nContext = createContext<I18nContextType>({
  lang: 'en',
  t: en,
  toggleLanguage: async () => {},
  format: (template) => template,
  getSpeciesName: (key) => key,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    // Load saved language from AsyncStorage
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved === 'en' || saved === 'bn') {
          setLang(saved);
        }
      })
      .catch((err) => {
        console.warn('Failed to load saved language:', err);
      });
  }, []);

  const toggleLanguage = async () => {
    const next: Language = lang === 'en' ? 'bn' : 'en';
    setLang(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, next);
    } catch (err) {
      console.warn('Failed to persist language:', err);
    }
  };

  const format = (template: string, values: Record<string, string | number>): string => {
    let result = template;
    for (const [key, value] of Object.entries(values)) {
      result = result.replace(new RegExp(`%\\{${key}\\}`, 'g'), String(value));
    }
    return result;
  };

  const getSpeciesName = (key: string): string => {
    const normalized = key.toLowerCase().trim() as keyof typeof en.species;
    const currentTrans = translations[lang].species;
    return currentTrans[normalized] || key;
  };

  return (
    <I18nContext.Provider
      value={{
        lang,
        t: translations[lang],
        toggleLanguage,
        format,
        getSpeciesName,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => useContext(I18nContext);
