import {LitElement, property, html} from 'lit-element';
import cloneDeep from 'lodash-es/cloneDeep';
import {filterByIds} from '../utils/utils';
import {fireEvent} from '../utils/fire-custom-event';
import {validateRequiredFields} from '../utils/validation-helper';
import isEmpty from 'lodash-es/isEmpty';
import ContentPanelMixin from './content-panel-mixin';
import ModelChangedMixing from './model-changed-mixin';
import {AnyObject, Constructor, MinimalUser} from '@unicef-polymer/etools-types';
import {translate} from 'lit-translate';

function ComponentBaseMixin<T extends Constructor<LitElement>>(baseClass: T) {
  class ComponentBaseClass extends ContentPanelMixin(ModelChangedMixing(baseClass)) {
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
      return validateRequiredFields(this);
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
            <div class="layout-horizontal right-align row-padding-v">
              <paper-button class="default" @click="${this.cancel}">${translate('GENERAL.CANCEL')}</paper-button>
              <paper-button class="primary" @click="${this.save}"> ${translate('GENERAL.SAVE')} </paper-button>
            </div>
          `;
    }

    renderEditBtn(editMode: boolean, canEditAnyFields: boolean) {
      return this.hideEditIcon(editMode, canEditAnyFields)
        ? html``
        : html` <paper-icon-button @click="${this.allowEdit}" icon="create"> </paper-icon-button> `;
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
      // eslint-disable-next-line
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
  }
  return ComponentBaseClass;
}

export default ComponentBaseMixin;
