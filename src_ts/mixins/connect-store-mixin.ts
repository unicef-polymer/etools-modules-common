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
    _storeUnsubscribe: Unsubscribe | null = null;

    private _store!: Store<any>;
    constructor(...args: any[]) {
      super(...args);
      getStoreAsync().then((store: Store<any>) => {
        this._store = store;
        if (this.getLazyReducers()) {
          (store as any).addReducers(this.getLazyReducers());
        }
        if (this.isConnected) {
          this._subscribeOnStore();
        }
      });
    }
    connectedCallback(): void {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      if (this._store) {
        this._subscribeOnStore();
      }
    }
    disconnectedCallback() {
      if (this._storeUnsubscribe) {
        this._storeUnsubscribe();
        this._storeUnsubscribe = null;
      }
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
    }

    stateChanged(_state: any) {}
    getLazyReducers(): any {
      return false;
    }

    private _subscribeOnStore(): void {
      if (this._storeUnsubscribe) {
        return;
      }
      this._storeUnsubscribe = this._store.subscribe(() => this.stateChanged(this._store.getState()));
      this.stateChanged(this._store.getState());
    }
  };
}
