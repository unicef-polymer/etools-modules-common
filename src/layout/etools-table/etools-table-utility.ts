/**
 * Utility functions used in etools data lists
 */

import {AnyObject} from '@unicef-polymer/etools-types';

export type EtoolsTableUtilityColumn = {
  label?: string;
  name?: string;
  type?: string;
  sort?: string;
  link_tmpl?: string;
  isExternalLink?: string;
  capitalize?: boolean;
  placeholder?: string;
  customMethod?: any;
  sortMethod?: string;
  cssClass?: string;
};

export interface EtoolsTableUtilitySortItem {
  name?: string;
  sort?: string;
}

export const getUrlQueryStringSort = (sortFields: EtoolsTableUtilityColumn[]): string => {
  let sort = '';
  if (sortFields.length > 0) {
    sort = sortFields
      .filter(({sort}: EtoolsTableUtilitySortItem) => Boolean(sort))
      .map((sortItem: EtoolsTableUtilitySortItem) => `${sortItem.name}.${sortItem.sort}`)
      .join('|');
  }
  return sort;
};

export const getSortFields = (columns: EtoolsTableUtilityColumn[]): EtoolsTableUtilitySortItem[] => {
  let sortItems: EtoolsTableUtilitySortItem[] = [];
  const sortedColumns: any[] = columns.filter((c: EtoolsTableUtilityColumn) => c.sort !== undefined);
  if (sortedColumns.length > 0) {
    sortItems = sortedColumns.map((c: EtoolsTableUtilityColumn) =>
      Object.assign({}, {name: c.name, sort: c.sort})
    ) as EtoolsTableUtilitySortItem[];
  }
  return sortItems;
};

export const getSortFieldsFromUrlSortParams = (param: string): EtoolsTableUtilitySortItem[] => {
  const sortFields: EtoolsTableUtilitySortItem[] = param.split('|').map((sort: string) => {
    const s = sort.split('.');
    const sortItem = {
      name: s[0],
      sort: s[1]
    } as EtoolsTableUtilitySortItem;
    return sortItem;
  });
  return sortFields;
};

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
