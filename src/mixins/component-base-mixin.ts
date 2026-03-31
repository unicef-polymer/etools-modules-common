import {LitElement, html} from 'lit';
import {property, query} from 'lit/decorators.js';
import cloneDeep from 'lodash-es/cloneDeep';
import {filterByIds} from '@unicef-polymer/etools-utils/src/general.util';
import {fireEvent} from '@unicef-polymer/etools-utils/src/fire-event.util';
import {validateRequiredFields} from '../utils/validation-helper';
import isEmpty from 'lodash-es/isEmpty';
import ModelChangedMixin, { ModelChangedMixinMethods } from './model-changed-mixin';
import {AnyObject, Constructor, MinimalUser} from '@unicef-polymer/etools-types';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import '@unicef-polymer/etools-unicef/src/etools-icon-button/etools-icon-button';
import {EtoolsContentPanel} from '@unicef-polymer/etools-unicef/src/etools-content-panel/etools-content-panel';

type ComponentBaseMixinContentPanel = EtoolsContentPanel | undefined;

export interface ComponentBaseMixinMethods {
  contentPanel?: ComponentBaseMixinContentPanel;
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
  validate(): any;

  // Implemented in child components
  saveData(): Promise<any>;
  save(): void;

  renderActions(editMode: boolean, canEditAnyFields: boolean): any;
  renderEditBtn(editMode: boolean, canEditAnyFields: boolean): any;
  renderReadonlyUserDetails(selectedUsers: any[], allUsers?: any[]): any;
  renderNameEmailPhone(item: any): any;

  handleUsersNoLongerAssignedToCurrentCountry(
    availableUsers: AnyObject[],
    savedUsers?: MinimalUser[]
  ): boolean;

  openContentPanel(): void;
}

function ComponentBaseMixin<T extends Constructor<LitElement>>(
  baseClass: T
): T & Constructor<ComponentBaseMixinMethods & ModelChangedMixinMethods> {
  class ComponentBaseClass extends ModelChangedMixin(baseClass) {
    @query('etools-content-panel')
    contentPanel?: EtoolsContentPanel;

    @property({type: Boolean})
    editMode = false;

    @property({type: Boolean})
    canEditAtLeastOneField = false;

    @property({type: Object})
    originalData!: any;

    @property({type: Object})
    data: any = {};

    @property({type: Object})
    permissions!: any;

    set_canEditAtLeastOneField(editPermissions: AnyObject) {
      this.canEditAtLeastOneField = Object.keys(editPermissions).some((key: string) => editPermissions[key] === true);
    }

    hideEditIcon(editMode: boolean, canEdit: boolean) {
      return !canEdit || editMode;
    }

    hideActionButtons(editMode: boolean, canEdit: boolean) {
      if (!canEdit) {
        return true;
      }

      return !editMode;
    }

    isReadonly(editMode: boolean, canEdit: boolean) {
      return !(editMode && canEdit);
    }

    allowEdit() {
      this.editMode = true;
      this.openContentPanel();
    }

    cancel() {
      this.data = cloneDeep(this.originalData);
      this.editMode = false;
    }

    validate() {
      return validateRequiredFields(this as any);
    }

    // To be implemented in child component
    saveData(): Promise<any> {
      return Promise.reject('Not Implemented');
    }

    save() {
      fireEvent(this, 'global-loading', {
        active: true,
        loadingSource: this.localName
      });
      this.saveData().finally(() => {
        fireEvent(this, 'global-loading', {
          active: false,
          loadingSource: this.localName
        });
      });
    }

    renderActions(editMode: boolean, canEditAnyFields: boolean) {
      return this.hideActionButtons(editMode, canEditAnyFields)
        ? html``
        : html`
            <div class="right-align padding-v">
              <etools-button variant="neutral" @click="${this.cancel}">${translate('GENERAL.CANCEL')}</etools-button>
              <etools-button variant="primary" @click="${this.save}"> ${translate('GENERAL.SAVE')} </etools-button>
            </div>
          `;
    }

    renderEditBtn(editMode: boolean, canEditAnyFields: boolean) {
      return this.hideEditIcon(editMode, canEditAnyFields)
        ? html``
        : html` <etools-icon-button @click="${this.allowEdit}" name="create"> </etools-icon-button> `;
    }

    renderReadonlyUserDetails(selectedUsers: any[], allUsers?: any[]) {
      if (isEmpty(selectedUsers)) {
        return html`<span class="placeholder">—</span>`;
      }
      if (!isEmpty(allUsers)) {
        selectedUsers = filterByIds(allUsers!, selectedUsers);
      }

      return selectedUsers.map((u: any) => {
        return html`<div class="w100 padd-between">${this.renderNameEmailPhone(u)}</div>`;
      });
    }

    renderNameEmailPhone(item: any) {
      return html`${item.first_name} ${item.last_name}
      (${item.email ? item.email : ''}${item.phone ? ', ' + item.phone : ''})`;
    }

    /**
     * check if already saved users exist on loaded data, if not they will be added
     * (they might be missing if changed country)
     */
    handleUsersNoLongerAssignedToCurrentCountry(availableUsers: AnyObject[], savedUsers?: MinimalUser[]) {
      if (!(savedUsers && savedUsers.length > 0 && availableUsers && availableUsers.length > 0)) {
        return false;
      }

      let changed = false;
      savedUsers.forEach((savedUsr) => {
        if (availableUsers.findIndex((x) => x.id === savedUsr.id) < 0) {
          availableUsers.push(savedUsr);
          changed = true;
        }
      });
      if (changed) {
        availableUsers.sort((a, b) => (a.name < b.name ? -1 : 1));
      }
      return changed;
    }

    openContentPanel(): void {
      if (this.contentPanel) {
        this.contentPanel.open = true;
      }
    }
  }
  return ComponentBaseClass as unknown as T & Constructor<ComponentBaseMixinMethods & ModelChangedMixinMethods>;
}

export default ComponentBaseMixin;
