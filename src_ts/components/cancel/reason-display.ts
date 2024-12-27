import {LitElement, html} from 'lit';
import {property} from 'lit/decorators.js';
import {sharedStyles} from '../../styles/shared-styles-lit';
import '@unicef-polymer/etools-unicef/src/etools-content-panel/etools-content-panel';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import {get as getTranslation} from '@unicef-polymer/etools-unicef/src/etools-translate';

/**
 * @customElement
 */
export class ReasonDisplay extends LitElement {
  @property() justification!: string;
  @property() title = getTranslation('CANCELLATION_NOTE');

  render() {
    // language=HTML
    return html`
      ${sharedStyles}
      <style>
        :host {
          display: block;
          margin-bottom: 24px;
        }

        etools-content-panel::part(ecp-header-title) {
          font-weight: 500;
          text-align: left;
          font-size: var(--etools-font-size-18, 18px);
          margin-inline-start: 80px;
        }

        .text {
          font-size: var(--etools-font-size-17, 17px);
          white-space: var(--text-wrap, pre-wrap);
          color: var(--primary-text-color);
          padding: var(--text-padding, 26px 12px 26px 80px);
        }

        div[slot='panel-btns'].bookmark {
          position: absolute;
          top: 4px;
          inset-inline-end: auto;
          inset-inline-start: 20px;
          color: grey;
          -webkit-transform: scale(0.9, 1.5);
          -moz-transform: scale(0.9, 1.5);
          -ms-transform: scale(0.9, 1.5);
          -o-transform: scale(0.9, 1.5);
          transform: scale(0.9, 1.5);
          opacity: 1;
        }

        div[slot='panel-btns'].bookmark etools-icon {
          --etools-icon-font-size: var(--etools-font-size-60, 60px);
          color: var(--flag-color, gray);
        }
      </style>
      <etools-content-panel class="cancellation-tab" .panelTitle="${this.title}">
        <div slot="panel-btns" class="bookmark">
          <etools-icon name="bookmark"></etools-icon>
        </div>

        <div class="text"><slot>${this.justification}</slot></div>
      </etools-content-panel>
    `;
  }
}

window.customElements.define('reason-display', ReasonDisplay);
