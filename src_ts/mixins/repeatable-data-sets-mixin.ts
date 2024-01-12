import {LitElement} from 'lit';
import {property} from 'lit/decorators.js';
import {sendRequest} from '@unicef-polymer/etools-utils/dist/etools-ajax/ajax-request';
import {cloneDeep} from '@unicef-polymer/etools-utils/dist/general.util';
import '../layout/are-you-sure';
import {AnyObject, Constructor} from '@unicef-polymer/etools-types';
import {translate} from 'lit-translate';
import {openDialog} from '@unicef-polymer/etools-utils/dist/dialog.util';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';

function RepeatableDataSetsMixin<T extends Constructor<LitElement>>(baseClass: T) {
  class RepeatableDataSetsClass extends baseClass {
    @property({type: String})
    deleteConfirmationTitle = translate('DELETE_CONFIRMATION') as unknown as string;

    @property({type: String})
    deleteConfirmationMessage = translate('ARE_YOU_SURE_DEL') as unknown as string;

    @property({type: String})
    deleteActionLoadingMsg = translate('DELETE_FROM_SERVER') as unknown as string;

    @property({type: String})
    deleteLoadingSource = 'delete-data-set';

    @property({type: String})
    deleteActionDefaultErrMsg = translate('DELETE_FAILED') as unknown as string;

    @property({type: Array})
    data!: any[];

    @property({type: Boolean})
    editMode!: boolean;

    @property({type: Object})
    dataSetModel!: AnyObject | null;

    elToDeleteIndex!: number;

    async _openDeleteConfirmation(event: CustomEvent, index: number) {
      event.stopPropagation();
      if (!this.editMode) {
        return;
      }
      this.elToDeleteIndex = index;
      const confirmed = await openDialog({
        dialog: 'are-you-sure',
        dialogData: {
          content: this.deleteConfirmationMessage,
          confirmBtnText: translate('GENERAL.YES') as unknown as string
        }
      }).then(({confirmed}) => {
        return confirmed;
      });

      this._onDeleteConfirmation(confirmed);
    }

    public _onDeleteConfirmation(confirmed: boolean) {
      if (!confirmed) {
        this.elToDeleteIndex = -1;
        return;
      }

      const id = this.data[this.elToDeleteIndex] ? this.data[this.elToDeleteIndex].id : null;
      if (!id) {
        this._deleteElement();
        this.elToDeleteIndex = -1;
        return;
      }
      // @ts-ignore
      if (!this._deleteEpName) {
        // logError('You must define _deleteEpName property to be able to remove existing records');
        return;
      }

      fireEvent(this, 'global-loading', {
        message: this.deleteActionLoadingMsg,
        active: true,
        loadingSource: this.deleteLoadingSource
      });

      let endpointParams = {id: id};
      // @ts-ignore
      if (this.extraEndpointParams) {
        // @ts-ignore
        endpointParams = {...endpointParams, ...this.extraEndpointParams};
      }
      // @ts-ignore
      const deleteEndpoint = this.getEndpoint(this._deleteEpName, endpointParams);
      sendRequest({
        method: 'DELETE',
        endpoint: deleteEndpoint,
        body: {}
      })
        .then(() => {
          this._handleDeleteResponse();
        })
        .catch((error: any) => {
          this._handleDeleteError(error.response);
        });
    }

    public _handleDeleteResponse() {
      this._deleteElement();
      this.elToDeleteIndex = -1;
      fireEvent(this, 'global-loading', {
        active: false,
        loadingSource: this.deleteLoadingSource
      });
    }

    public _handleDeleteError(responseErr: any) {
      fireEvent(this, 'global-loading', {
        active: false,
        loadingSource: this.deleteLoadingSource
      });

      let msg = this.deleteActionDefaultErrMsg;
      if (responseErr instanceof Array && responseErr.length > 0) {
        msg = responseErr.join('\n');
      } else if (typeof responseErr === 'string') {
        msg = responseErr;
      }
      fireEvent(this, 'toast', {text: msg, showCloseBtn: true});
    }

    public _deleteElement() {
      if (!this.editMode) {
        return;
      }
      const index = Number(this.elToDeleteIndex);
      if (index >= 0) {
        this.data.splice(index, 1);
        // To mke sure all req. observers are triggered
        this.data = cloneDeep(this.data);

        fireEvent(this, 'delete-confirm', {index: this.elToDeleteIndex});
      }
    }

    /**
     * selValue - the just selected value or id
     * selIndex - the index of the selected data item
     * itemValueName - the name of property to compare selValue against
     */
    public isAlreadySelected(selValue: any, selIndex: any, itemValueName: any) {
      const duplicateItems =
        this.data &&
        this.data.filter((item, index) => {
          return parseInt(item[itemValueName]) === parseInt(selValue) && parseInt(String(index)) !== parseInt(selIndex);
        });
      return duplicateItems && duplicateItems.length;
    }
  }
  return RepeatableDataSetsClass;
}

export default RepeatableDataSetsMixin;
