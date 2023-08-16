import {Constructor} from '@unicef-polymer/etools-types';
import {LitElement} from 'lit';
declare function UtilsMixin<T extends Constructor<LitElement>>(
  baseClass: T
): {
  new (...args: any[]): {
    _equals(a: any, b: any): boolean;
    _toNumber(val: any): number;
    _formatNumber(val: any, placeholder: any, decimals: any, thousandsPoint: any, decimalsPoint?: any): any;
    capitalizeFirstLetter(text: string): string;
    _deferred(): any;
    _toPercentage(value: any): any;
    _fieldsAreValid(): boolean;
    _ternary(value: any, expected: any, value1: any, value2: any): any;
    _withDefault(value: any, defaultValue: any): any;
    _formatIndicatorValue(displayType: string, value: any, percentize: boolean): any;
  };
} & T;
export default UtilsMixin;
