import { EtoolsContentPanel } from '@unicef-polymer/etools-content-panel/etools-content-panel';
import { Constructor } from '@unicef-polymer/etools-types';
import { LitElement } from 'lit-element';
declare function ContentPanelMixin<T extends Constructor<LitElement>>(
  baseClass: T
): {
  new (...args: any[]): {
    contentPanel?: EtoolsContentPanel | undefined;
    openContentPanel(): void;
  };
} & T;
export default ContentPanelMixin;
