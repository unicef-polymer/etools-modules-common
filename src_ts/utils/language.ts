import {
  langChanged,
  translateConfig,
  get as getTranslation,
  translate
} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {formatDate} from '@unicef-polymer/etools-utils/dist/date.util';

export function getTranslatedValue(value: string, keyPrefix?: string) {
  if (!value) {
    return value;
  }

  const key = [keyPrefix, value.replace(/ /g, '_').toUpperCase()].filter(Boolean);
  return getTranslation(key.join('.'), undefined, {
    ...translateConfig,
    empty: () => value
  });
}

export function translateValue(value: string, keyPrefix?: string): ReturnType<typeof langChanged> {
  return langChanged(() => getTranslatedValue(value, keyPrefix));
}

export function formatDateLocalized(date: Date | string, format?: string): ReturnType<typeof langChanged> {
  return langChanged(() => formatDate(date, format));
}

export function hasTranslations() {
  return translateConfig.lang && translateConfig.strings;
}

export function translateIfAvailable(key: string, fallbackText: string): ReturnType<typeof translate> | string {
  return hasTranslations() ? translate(key) : fallbackText;
}

export function getTranslationIfAvailable(key: string, fallbackText: string) {
  return hasTranslations() ? getTranslation(key) : fallbackText;
}
