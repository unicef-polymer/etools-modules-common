import {Constructor} from '@unicef-polymer/etools-types';
import {LitElement} from 'lit';
/**
 * @polymer
 * @mixinFunction
 */
declare function UploadsMixin<T extends Constructor<LitElement>>(
  baseClass: T
): {
  new (...args: any[]): {
    uploadEndpoint: string;
    uploadsInProgress: number;
    unsavedUploads: number;
    uploadsStateChanged(state: any): void;
    _onUploadStarted(e: any): void;
    _onUploadFinished(success: any): void;
    _onChangeUnsavedFile(e: any): void;
    _onUploadDelete(): void;
    _onUploadSaved(): void;
    decreaseUnsavedUploads(): void;
  };
} & T;
export default UploadsMixin;
