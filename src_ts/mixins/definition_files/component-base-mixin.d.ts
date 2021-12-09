import {AnyObject, Constructor, MinimalUser} from '@unicef-polymer/etools-types';
import {LitElement} from 'lit-element';
import ContentPanelMixin from './content-panel-mixin';
declare function ComponentBaseMixin<T extends Constructor<LitElement>>(
  baseClass: T
): {
  new (...args: any[]): {
    editMode: boolean;
    canEditAtLeastOneField: boolean;
    originalData: any;
    data: any;
    permissions: any;
    set_canEditAtLeastOneField(editPermissions: AnyObject): void;
    hideEditIcon(editMode: boolean, canEdit: boolean): boolean;
    hideActionButtons(editMode: boolean, canEdit: boolean): boolean;
    isReadonly(editMode: boolean, canEdit: boolean): boolean;
    allowEdit(): void;
    cancel(): void;
    validate(): boolean;
    saveData(): Promise<any>;
    save(): void;
    renderActions(editMode: boolean, canEditAnyFields: boolean): import('lit-element').TemplateResult;
    renderEditBtn(editMode: boolean, canEditAnyFields: boolean): import('lit-element').TemplateResult;
    renderReadonlyUserDetails(
      selectedUsers: any[],
      allUsers?: any[] | undefined
    ): import('lit-element').TemplateResult | import('lit-element').TemplateResult[];
    renderNameEmailPhone(item: any): import('lit-element').TemplateResult;
    selectedItemChanged(detail: any, key: string, optionValue?: string): void;
    selectedUserChanged(detail: any, key: string): void;
    selectedUsersChanged(detail: any, key: string): void;
    dateHasChanged(
      detail: {
        date: Date;
      },
      key: string
    ): void;
    selectedItemsChanged(detail: any, key: string, optionValue?: string): void;
    valueChanged(detail: any, key: string): void;
    /**
     * check if already saved users exist on loaded data, if not they will be added
     * (they might be missing if changed country)
     */
    handleUsersNoLongerAssignedToCurrentCountry(
      availableUsers: AnyObject[],
      savedUsers?: MinimalUser[] | undefined
    ): boolean;
  };
} & T &
  ReturnType<typeof ContentPanelMixin>;
export default ComponentBaseMixin;
