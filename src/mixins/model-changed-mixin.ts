import {LitElement} from 'lit';
import {areEqual} from '@unicef-polymer/etools-utils/src/equality-comparisons.util';
import {formatDate} from '@unicef-polymer/etools-utils/src/date.util';
import {Constructor} from '@unicef-polymer/etools-types';

export interface ModelChangedMixinMethods {
  getParentObject(parentObject?: string | object): object;
  triggerUpdateValue(value: any, key: string, parentObject?: string | object): void;

  selectedItemChanged(detail: {selectedItem: any}, key: string, optionValue?: string, parentObject?: string | object): void;
  selectedUserChanged(detail: {selectedItem: any}, key: string, parentObject?: string | object): void;
  selectedUsersChanged(detail: {selectedItems: any}, key: string, parentObject?: string | object): void;
  dateHasChanged(detail: {date: Date}, key: string, parentObject?: string | object): void;

  selectedItemsChanged(
    detail: {selectedItems: any},
    key: string,
    optionValue?: string,
    parentObject?: string | object
  ): void;
  valueChanged(detail: {value: any}, key: string, parentObject?: string | object): void;
  numberChanged(detail: {value: any}, key: string, parentObject?: string | object): void;
};

function ModelChangedMixin<T extends Constructor<LitElement>>(
  baseClass: T
): T & Constructor<ModelChangedMixinMethods> {
  class ModelChangedClass extends baseClass {
    getParentObject(parentObject?: string | object): object {
      if (!parentObject) {
        // @ts-ignore
        return this['data'];
      }

      if (typeof parentObject === 'string' || parentObject instanceof String) {
        // @ts-ignore
        return this[parentObject];
      }

      return parentObject;
    }

    triggerUpdateValue(value: any, key: string, parentObject?: string | object) {
      const parent = this.getParentObject(parentObject);
      /**
       * Event though requestUpdate checks hasChanged method,
       * it seems that it still re-renders even if the item hasn't really changed
       * Remove this line and render will be called infinitely
       */
      // @ts-ignore
      if (areEqual(parent[key], value)) {
        return;
      }

      // @ts-ignore
      parent[key] = value;
      /** Necessary because LitElement remembers the values used for last render
       *  and resetting the form on cancel won't work otherwise
       */
      this.requestUpdate();
    }

    selectedItemChanged(detail: {selectedItem: any}, key: string, optionValue = 'id', parentObject?: string | object) {
      if (detail.selectedItem === undefined) {
        return;
      }
      const newValue = detail.selectedItem ? detail.selectedItem[optionValue] : null;
      this.triggerUpdateValue(newValue, key, parentObject);
    }

    selectedUserChanged(detail: {selectedItem: any}, key: string, parentObject?: string | object) {
      if (detail.selectedItem === undefined) {
        return;
      }
      const newValue = detail.selectedItem;
      this.triggerUpdateValue(newValue, key, parentObject);
    }

    selectedUsersChanged(detail: {selectedItems: any}, key: string, parentObject?: string | object) {
      if (detail.selectedItems === undefined) {
        return;
      }
      const newValue = detail.selectedItems;
      this.triggerUpdateValue(newValue, key, parentObject);
    }

    dateHasChanged(detail: {date: Date}, key: string, parentObject?: string | object) {
      if (detail.date === undefined) {
        return;
      }
      const newValue = formatDate(detail.date, 'YYYY-MM-DD');
      this.triggerUpdateValue(newValue, key, parentObject);
    }

    selectedItemsChanged(
      detail: {selectedItems: any},
      key: string,
      optionValue = 'id',
      parentObject?: string | object
    ) {
      if (detail.selectedItems === undefined) {
        return;
      }
      const newValues = detail.selectedItems.map((i: any) => i[optionValue]);
      this.triggerUpdateValue(newValues, key, parentObject);
    }

    valueChanged(detail: {value: any}, key: string, parentObject?: string | object) {
      this.triggerUpdateValue(detail.value, key, parentObject);
    }

    numberChanged(detail: {value: any}, key: string, parentObject?: string | object) {
      const parent = this.getParentObject(parentObject);
      // @ts-ignore
      if (areEqual(parseFloat(parent[key] as string), parseFloat(detail.value as string))) {
        return;
      }

      // @ts-ignore
      parent[key] = detail.value == null ? null : parseFloat(detail.value as string);
      this.requestUpdate();
    }
  }

  // Explicit return typing prevents TS from emitting an "exported anonymous class type"
  // that includes LitElement private/protected internals (e.g. `__childPart`).
  return ModelChangedClass as unknown as  T & Constructor<ModelChangedMixinMethods>;
}

export default ModelChangedMixin;
