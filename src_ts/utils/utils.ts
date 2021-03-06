import isObject from 'lodash-es/isObject';
import isEmpty from 'lodash-es/isEmpty';
import {formatDate} from './date-utils';
import {AnyObject} from '@unicef-polymer/etools-types';

export const isJsonStrMatch = (a: any, b: any) => {
  return JSON.stringify(a) === JSON.stringify(b);
};

export const isEmptyObject = (a: any) => {
  if (!a) {
    return true;
  }
  if (Array.isArray(a) && a.length === 0) {
    return true;
  }
  return isObject(a) && Object.keys(a).length === 0;
};

export const cloneDeep = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};

export const getFileNameFromURL = (url?: string) => {
  if (!url) {
    return '';
  }
  // @ts-ignore
  return url.split('?').shift().split('/').pop();
};

/**
 * Cases that should return `true` also
 * 1 should equal '1'
 * [1] should equal ['1']
 * {any: 1} should equal {any: '1'}
 */
export const areEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 == null && obj2 == null) {
    return true;
  }
  if (obj1 == undefined && obj2 == undefined) {
    return true;
  }
  if (([null, undefined].includes(obj1) && obj2) || (obj1 && [null, undefined].includes(obj2))) {
    return false;
  }

  if (obj1 instanceof Date) {
    return formatDate(obj1, 'YYYY-MM-DD') === _formatYYYY_MM_DD(obj2);
  }

  if (obj2 instanceof Date) {
    return formatDate(obj2, 'YYYY-MM-DD') === _formatYYYY_MM_DD(obj1);
  }

  if (Array.isArray(obj1)) {
    return obj1.length === obj2.length && obj1.every((o: any, i: number) => areEqual(o, obj2[i]));
  }
  if (typeof obj1 === 'object' && ![null, undefined].includes(obj1)) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    return keys1.length === keys2.length && keys1.every((key: string) => areEqual(obj1[key], obj2[key]));
  }
  if (obj1 != obj2) {
    return false;
  }
  return true;
};

// TODO: Can this be optimized for cases when allOptions is a super long list?
export const filterByIds = <T>(allOptions: T[], givenIds: string[]): T[] => {
  if (isEmpty(allOptions) || isEmpty(givenIds)) {
    return [];
  }

  const intGivenIds = givenIds.map((id: string) => Number(id));
  const options = allOptions.filter((opt: any) => {
    return intGivenIds.includes(Number(opt.id));
  });

  return options;
};

function _formatYYYY_MM_DD(obj2: string | Date) {
  if (typeof obj2 === 'string') {
    return obj2;
  }
  return formatDate(obj2, 'YYYY-MM-DD');
}

export const buildUrlQueryString = (params: AnyObject): string => {
  const queryParams = [];

  for (const param in params) {
    if (!params[param]) {
      continue;
    }
    const paramValue = params[param];
    let filterUrlValue;

    if (paramValue instanceof Array) {
      if (paramValue.length > 0) {
        filterUrlValue = paramValue.join(',');
      }
    } else if (typeof paramValue === 'boolean') {
      if (paramValue) {
        // ignore if it's false
        filterUrlValue = 'true';
      }
    } else {
      if (!(param === 'page' && paramValue === 1)) {
        // do not include page if page=1
        filterUrlValue = String(paramValue).trim();
      }
    }

    if (filterUrlValue) {
      queryParams.push(param + '=' + filterUrlValue);
    }
  }

  return queryParams.join('&');
};

export function decimalFractionEquals0(val: string) {
  return val.lastIndexOf('.') > 0 && Number(val.substring(val.lastIndexOf('.') + 1)) === 0;
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
