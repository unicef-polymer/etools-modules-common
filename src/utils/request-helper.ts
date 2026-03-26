import {sendRequest, RequestConfig} from '@unicef-polymer/etools-utils/src/etools-ajax/ajax-request';
import {formatServerErrorAsText} from '@unicef-polymer/etools-utils/src/etools-ajax/ajax-error-parser';
import {fireEvent} from '@unicef-polymer/etools-utils/src/fire-event.util';

export const _sendRequest = (etoolsReqConfig: RequestConfig, _requestKey?: string) => {
  return sendRequest(etoolsReqConfig, _requestKey)
    .then((response: any) => response)
    .catch((error: any) => {
      if (error.status === 401) {
        // TODO
      }
      fireEvent(document.body, 'toast', {
        text: formatServerErrorAsText(error),
        showCloseBtn: true
      });
      throw error;
    });
};
