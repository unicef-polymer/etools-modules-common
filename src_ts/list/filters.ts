import {AnyObject, RouteQueryParams} from '@unicef-polymer/etools-types';
import {EtoolsFilter} from '../layout/filters/etools-filters';
import {isJsonStrMatch} from '../utils/utils';

let selectedValueTypeByFilterKey: any;

export function setselectedValueTypeByFilterKey(val: any) {
  selectedValueTypeByFilterKey = val;
}

export const getSelectedFiltersFromUrlParams = (params: AnyObject) => {
  const selectedFilters: AnyObject = {};

  for (const filterKey in params) {
    if (params[filterKey]) {
      if (selectedValueTypeByFilterKey[filterKey] === 'Array') {
        selectedFilters[filterKey] = params[filterKey].split(',');
      } else if (selectedValueTypeByFilterKey[filterKey] === 'boolean') {
        selectedFilters[filterKey] = params[filterKey] === 'true';
      } else {
        selectedFilters[filterKey] = params[filterKey];
      }
    }
  }
  return selectedFilters;
};

export const updateFiltersSelectedValues = (params: RouteQueryParams, filters: EtoolsFilter[]) => {
  const availableFilters = [...filters];

  const selectedFilters = getSelectedFiltersFromUrlParams(params);
  for (const fKey in selectedFilters) {
    if (fKey) {
      const selectedValue = selectedFilters[fKey];
      if (selectedValue) {
        const filter = availableFilters.find((f: EtoolsFilter) => f.filterKey === fKey);
        if (filter) {
          filter.selectedValue = selectedValue instanceof Array ? [...selectedValue] : selectedValue;

          filter.selected = true;
        }
      }
    }
  }

  return availableFilters;
};

export const updateFilterSelectionOptions = (filters: EtoolsFilter[], fKey: string, options: AnyObject[]) => {
  const filter = filters.find((f: EtoolsFilter) => f.filterKey === fKey);
  if (filter && options) {
    if (!isJsonStrMatch(filter.selectionOptions, options)) {
      filter.selectionOptions = [...options];
    }
  }
};
