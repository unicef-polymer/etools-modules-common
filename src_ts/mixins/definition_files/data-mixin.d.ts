import {LitElement, PropertyDeclarations} from 'lit';
import {GenericObject} from '@unicef-polymer/etools-types';
declare type Constructor<B> = new (...args: any[]) => B;
export declare const DataMixin: <T extends Constructor<LitElement>>() => <B>(superclass: T) => {
  new (...args: any[]): {
    editedData: Partial<B>;
    originalData: B | null;
    errors: GenericObject;
    data: B | null;
    connectedCallback(): void;
    resetFieldError(fieldName: string): void;
    updateModelValue(fieldName: keyof B, value: any): void;
    /**
     *  When valueA or B are objects the equality that is being performed looks like this:
     * '[object Object]' === '[object Object]'.Recomandation to use areEqual from utils
     */
    checkEquality(valueA: any, valueB: any): boolean;
  };
  readonly properties: PropertyDeclarations;
} & T;
export {};
