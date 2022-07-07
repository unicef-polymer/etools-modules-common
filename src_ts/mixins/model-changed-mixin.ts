import {LitElement} from 'lit-element';
import {areEqual} from '../utils/utils';
import {formatDate} from '../utils/date-utils';
import {Constructor} from '@unicef-polymer/etools-types';

function ModelChangedMixin<T extends Constructor<LitElement>>(baseClass: T) {
  class ModelChangedClass extends baseClass {
    getParentObject(parentObject?: string | object): object {
      if(!parentObject){
        // @ts-ignore
        return this['data'];
      }

      if (typeof parentObject === 'string' || parentObject instanceof String){
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

    selectedItemsChanged(detail: {selectedItems: any}, key: string, optionValue = 'id', parentObject?: string | object) {
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
      parent[key] = parseFloat(detail.value as string);
      this.requestUpdate();
    }
  }
  return ModelChangedClass;
}

export default ModelChangedMixin;
