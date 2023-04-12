import {langChanged, translateConfig, get as getTranslation} from 'lit-translate';
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

export function translateValue(value: string, keyPrefix?: string) {
  return langChanged(() => getTranslatedValue(value, keyPrefix));
}

export function formatDateLocalized(date: Date | string, format?: string) {
  return langChanged(() => formatDate(date, format));
}
