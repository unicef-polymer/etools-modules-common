import {Store, Unsubscribe} from 'redux';
import {Constructor} from '@unicef-polymer/etools-types';
import {getStoreAsync} from '@unicef-polymer/etools-utils/src/store.util';

interface CustomElement {
  connectedCallback?(): void;
  disconnectedCallback?(): void;
  readonly isConnected: boolean;
}

interface ConnectStoreMixinMethods {
  _storeUnsubscribe: Unsubscribe | null;
  _store: Store<any>;

  stateChanged(_state: any): void;
  getLazyReducers(): any;
  _subscribeOnStore(): void;
}

export function connectStore<T extends Constructor<CustomElement>>(
  baseClass: T
): T & Constructor<ConnectStoreMixinMethods> {
  const ConnectStoreMixinClass = class ConnectStoreMixin extends baseClass {
    _storeUnsubscribe: Unsubscribe | null = null;

    _store!: Store<any>;
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

    _subscribeOnStore(): void {
      if (this._storeUnsubscribe) {
        return;
      }
      this._storeUnsubscribe = this._store.subscribe(() => this.stateChanged(this._store.getState()));
      this.stateChanged(this._store.getState());
    }
  };

  return ConnectStoreMixinClass as unknown as T & Constructor<ConnectStoreMixinMethods>;
}
