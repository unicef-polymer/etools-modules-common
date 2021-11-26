import {LitElement, property} from 'lit-element';
import {Constructor} from '@unicef-polymer/etools-types';
import {getStore} from '..//utils/redux-store-access';

const INCREASE_UPLOADS_IN_PROGRESS = 'INCREASE_UPLOADS_IN_PROGRESS';
const DECREASE_UPLOADS_IN_PROGRESS = 'DECREASE_UPLOADS_IN_PROGRESS';
const INCREASE_UNSAVED_UPLOADS = 'INCREASE_UNSAVED_UPLOADS';
const DECREASE_UNSAVED_UPLOADS = 'DECREASE_UNSAVED_UPLOADS';

/**
 * @polymer
 * @mixinFunction
 */
function UploadsMixin<T extends Constructor<LitElement>>(baseClass: T) {
  class UploadsClass extends baseClass {
    @property({type: String})
    uploadEndpoint!: string;

    @property({type: Number})
    uploadsInProgress!: number;

    @property({type: Number})
    unsavedUploads!: number;

    uploadsStateChanged(state: any) {
      if (state.uploadStatus!.unsavedUploads !== this.unsavedUploads) {
        this.unsavedUploads = state.uploadStatus!.unsavedUploads;
      }

      if (state.uploadStatus!.uploadsInProgress !== this.uploadsInProgress) {
        this.uploadsInProgress = state.uploadStatus!.uploadsInProgress;
      }
    }

    public _onUploadStarted(e: any) {
      e.stopImmediatePropagation();
      getStore().dispatch({type: INCREASE_UPLOADS_IN_PROGRESS});
    }

    public _onUploadFinished(success: any) {
      getStore().dispatch({type: DECREASE_UPLOADS_IN_PROGRESS});
      if (success) {
        getStore().dispatch({type: INCREASE_UNSAVED_UPLOADS});
      }
    }

    public _onChangeUnsavedFile(e: any) {
      e.stopImmediatePropagation();
      this.decreaseUnsavedUploads();
    }

    public _onUploadDelete() {
      this.decreaseUnsavedUploads();
    }

    public _onUploadSaved() {
      this.decreaseUnsavedUploads();
    }

    decreaseUnsavedUploads() {
      getStore().dispatch({type: DECREASE_UNSAVED_UPLOADS});
    }
  }
  return UploadsClass;
}

export default UploadsMixin;
