import {LitElement} from 'lit';
import {query} from 'lit/decorators.js';
import {EtoolsContentPanel} from '@unicef-polymer/etools-unicef/src/etools-content-panel/etools-content-panel';
import {MixinTarget} from '../utils/types';

function ContentPanelMixin<T extends MixinTarget<LitElement>>(baseClass: T) {
  class ContentPanelMixin extends baseClass {
    @query('etools-content-panel')
    contentPanel?: EtoolsContentPanel;

    openContentPanel(): void {
      if (this.contentPanel) {
        this.contentPanel.open = true;
      }
    }
  }
  return ContentPanelMixin;
}

export default ContentPanelMixin;
