import {EtoolsContentPanel} from '@unicef-polymer/etools-unicef/src/etools-content-panel/etools-content-panel';
import {Constructor} from '@unicef-polymer/etools-types';
import {LitElement} from 'lit';
declare function ContentPanelMixin<T extends Constructor<LitElement>>(
  baseClass: T
): {
  new (...args: any[]): {
    contentPanel?: EtoolsContentPanel | undefined;
    openContentPanel(): void;
  };
} & T;
export default ContentPanelMixin;
