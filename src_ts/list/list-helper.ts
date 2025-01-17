import isEqual from 'lodash-es/isEqual';
import sortBy from 'lodash-es/sortBy';
import {sendRequest} from '@unicef-polymer/etools-utils/dist/etools-ajax/ajax-request';
import {abortRequestByKey} from '@unicef-polymer/etools-utils/dist/etools-ajax/request';
import {EtoolsEndpoint, GenericObject} from '@unicef-polymer/etools-types';
import {getEndpoint} from '@unicef-polymer/etools-utils/dist/endpoint.util';

export const defaultPaginator = {
  page: 1,
  page_size: 20,
  total_pages: 0,
  count: 0,
  visible_range: [] as any[]
};

export type ListHelperPaginator = typeof defaultPaginator;

export type ListHelperResponse<T> = {
  list: T[];
  paginator: ListHelperPaginator;
};

export class ListHelper<T> {
  listData: T[] = [];
  lastParams!: GenericObject<string>;
  requestInProcess = false;
  readonly requestUid = 'INTERVENTIONS_REQUEST';

  constructor(
    public endpoint: EtoolsEndpoint,
    public store: any
  ) {}

  async getList(params: GenericObject<string>, forceReGet: boolean): Promise<ListHelperResponse<T>> {
    const {page = 1, page_size: pageSize = this.listData.length, sort, ...filters} = params;
    // checks if filters was changed and returns interventions list
    const filteredList: T[] = await this.getFilteredList(filters, forceReGet);
    // returns sorted list if sort param exists
    const sortedList: T[] = this.sortList(filteredList, sort);
    // paginates list depending on provided params
    const list: T[] = this.paginate(Number(page), Number(pageSize), sortedList);
    const paginator: ListHelperPaginator = this.getPaginationData(Number(page), Number(pageSize), filteredList.length);
    return {
      list,
      paginator
    };
  }

  async getFilteredList(filtersParams: GenericObject<string>, forceReGet: boolean): Promise<T[]> {
    if (isEqual(filtersParams, this.lastParams) && !forceReGet) {
      // return cached list if params wasn't changed
      return this.listData;
    } else {
      if (this.requestInProcess) {
        abortRequestByKey(this.requestUid);
      }
      this.requestInProcess = true;
      // save last params
      this.lastParams = filtersParams;
      // make request
      const list: T[] = await this.listRequest(filtersParams);
      this.requestInProcess = false;
      // cache response
      this.listData = list;
      return list;
    }
  }

  listRequest(filtersParams: GenericObject<string>): Promise<T[]> {
    return sendRequest(
      {
        endpoint: getEndpoint(this.endpoint),
        params: filtersParams
      },
      this.requestUid
    )
      .then((response) => {
        this.store.dispatch({
          type: 'SHOULD_REGET_LIST',
          shouldReGetList: false
        });
        return response;
      })
      .catch((error: any) => {
        // don't update flag if request was aborted
        if (error.status !== 0) {
          this.requestInProcess = false;
        }
        // This error must be handled inside component
        return Promise.reject(error);
      });
  }

  sortList(list: T[], sort = ''): T[] {
    const [field, direction] = sort.split('.') as [keyof T, string];
    if (!field || !direction || !list.length || !Object.hasOwnProperty.call(list[0], field)) {
      return list;
    }
    const sorted: T[] = sortBy(list, (intervention: T) => {
      if (field === 'end' || field === 'start') {
        const stringDate: string | null = intervention[field] as unknown as string;
        return stringDate ? new Date(stringDate).getTime() : 0;
      } else {
        return intervention[field];
      }
    });
    return direction === 'asc' ? sorted : sorted.reverse();
  }

  paginate(page: number, pageSize: number, data: T[]): T[] {
    const fromIndex: number = (page - 1) * pageSize;
    const toIndex: number = fromIndex + pageSize;
    return data.slice(fromIndex, toIndex);
  }

  getPaginationData(page: number, pageSize: number, count: number): ListHelperPaginator {
    return {
      page,
      page_size: pageSize,
      total_pages: count ? Math.ceil(count / pageSize) : page,
      count: count,
      visible_range: this.getVisibleRange(pageSize, page, count)
    };
  }

  getVisibleRange(pageSize: number, page: number, count: number): [number, number] {
    if (!count) {
      return [0, 0];
    }
    const from: number = (page - 1) * pageSize;
    const to: number = from + pageSize;
    if (from > count) {
      return [0, 0];
    }
    return [from + 1, Math.min(to, count)];
  }
}
