import {Constructor} from '@unicef-polymer/etools-types';
import {LitElement} from 'lit-element';
declare function ModelChangedMixin<T extends Constructor<LitElement>>(
  baseClass: T
): {
  new (...args: any[]): {
    getParentObject(parentObject?: string | object): object;
    triggerUpdateValue(value: any, key: string, parentObject?: string | object): void;
    selectedItemChanged(detail: {selectedItem: any}, key: string, optionValue?: string, parentObject?: string | object): void;
    selectedUserChanged(detail: {selectedItem: any}, key: string, parentObject?: string | object): void;
    selectedUsersChanged(detail: {selectedItems: any}, key: string, parentObject?: string | object): void;
    dateHasChanged(
      detail: {
        date: Date;
      },
      key: string,
      parentObject?: string
    ): void;
    selectedItemsChanged(detail: {selectedItems: any}, key: string, optionValue?: string, parentObject?: string | object): void;
    valueChanged(detail: {value: any}, key: string, parentObject?: string | object): void;
    numberChanged(detail: {value: any}, key: string, parentObject?: string | object): void;
  };
} & T;
export default ModelChangedMixin;
