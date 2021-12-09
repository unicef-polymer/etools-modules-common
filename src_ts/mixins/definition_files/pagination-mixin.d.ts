import {Constructor} from '@unicef-polymer/etools-types';
import {LitElement} from 'lit-element';
declare class Paginator {
  page: number;
  page_size: number;
  count: number | null;
  visible_range: string[] | number[];
}
declare function PaginationMixin<T extends Constructor<LitElement>>(
  baseClass: T
): {
  new (...args: any[]): {
    paginator: Paginator;
    pageSize: number;
    pageSizeChanged(e: CustomEvent): void;
    pageNumberChanged(e: CustomEvent): void;
    visibleRangeChanged(e: CustomEvent): void;
    getRequestPaginationParams(): {
      page: number;
      page_size: number;
    };
    updatePaginatorTotalResults(reqResponse: any): void;
    setPageSize(size: number): void;
    setPageNumber(page: number): void;
    resetPageNumber(): void;
    setPaginationDataFromUrlParams(urlParams: any): void;
    _pageInsidePaginationRange(page: number, total: number | null): void;
    _getLastPageNr(pageSize: number, total: number): number;
  };
} & T;
export default PaginationMixin;
