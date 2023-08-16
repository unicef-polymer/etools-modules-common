import '../layout/are-you-sure';
import {AnyObject, Constructor} from '@unicef-polymer/etools-types';
import {LitElement} from 'lit';
declare function RepeatableDataSetsMixin<T extends Constructor<LitElement>>(
  baseClass: T
): {
  new (...args: any[]): {
    deleteConfirmationTitle: string;
    deleteConfirmationMessage: string;
    deleteActionLoadingMsg: string;
    deleteLoadingSource: string;
    deleteActionDefaultErrMsg: string;
    data: any[];
    editMode: boolean;
    dataSetModel: AnyObject | null;
    elToDeleteIndex: number;
    _openDeleteConfirmation(event: CustomEvent, index: number): Promise<void>;
    _onDeleteConfirmation(confirmed: boolean): void;
    _handleDeleteResponse(): void;
    _handleDeleteError(responseErr: any): void;
    _deleteElement(): void;
    /**
     * selValue - the just selected value or id
     * selIndex - the index of the selected data item
     * itemValueName - the name of property to compare selValue against
     */
    isAlreadySelected(selValue: any, selIndex: any, itemValueName: any): number;
  };
} & T;
export default RepeatableDataSetsMixin;
