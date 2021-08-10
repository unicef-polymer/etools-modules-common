/* eslint-disable @typescript-eslint/no-empty-function */
import {Store, Unsubscribe} from 'redux';
import {Constructor} from '@unicef-polymer/etools-types';
import {getStoreAsync} from '../utils/redux-store-access';

interface CustomElement {
  connectedCallback?(): void;
  disconnectedCallback?(): void;
  readonly isConnected: boolean;
}

export function connectStore<T extends Constructor<CustomElement>>(baseClass: T) {
  return class ConnectStoreMixin extends baseClass {
    private _storeUnsubscribe!: Unsubscribe;

    constructor(...args: any[]) {
      super(...args);
      getStoreAsync().then((store: Store<any>) => {
        if (this.getLazyReducers()) {
          (store as any).addReducers(this.getLazyReducers());
        }
        this._storeUnsubscribe = store.subscribe(() => this.stateChanged(store.getState()));
        this.stateChanged(store.getState());
      });
    }
    disconnectedCallback() {
      if (this._storeUnsubscribe) {
        this._storeUnsubscribe();
      }
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
    }

    stateChanged(_state: any) {}
    getLazyReducers(): any {
      return false;
    }
  };
}
