import { Unsubscribe } from 'redux';
import { Constructor } from '@unicef-polymer/etools-types';
interface CustomElement {
    connectedCallback?(): void;
    disconnectedCallback?(): void;
    readonly isConnected: boolean;
}
export declare function connectStore<T extends Constructor<CustomElement>>(baseClass: T): {
    new (...args: any[]): {
        _storeUnsubscribe: Unsubscribe;
        disconnectedCallback(): void;
        stateChanged(_state: any): void;
        getLazyReducers(): any;
        connectedCallback?(): void;
        readonly isConnected: boolean;
    };
} & T;
export {};
