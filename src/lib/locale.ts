import { useLocale } from 'next-intl';
import { ptBR, enUS, ko } from 'date-fns/locale';
import type { Locale } from 'date-fns';

const DATE_FNS_LOCALES: Record<string, Locale> = {
  pt: ptBR,
  en: enUS,
  ko,
};

const BCP47_LOCALES: Record<string, string> = {
  pt: 'pt-BR',
  en: 'en-US',
  ko: 'ko-KR',
};

/** date-fns Locale matching the app's active next-intl locale (falls back to en). */
export function useDateFnsLocale(): Locale {
  const locale = useLocale();
  return DATE_FNS_LOCALES[locale] ?? enUS;
}

/** BCP-47 tag (for Intl/toLocaleDateString) matching the app's active next-intl locale. */
export function useIntlLocale(): string {
  const locale = useLocale();
  return BCP47_LOCALES[locale] ?? 'en-US';
}
