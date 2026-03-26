import {LitElement, html} from 'lit';
import {property} from 'lit/decorators.js';
import {sharedStyles} from '../../styles/shared-styles-lit';
import '@unicef-polymer/etools-unicef/src/etools-content-panel/etools-content-panel';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';

/**
 * @customElement
 */
export class CancelJustification extends LitElement {
  @property() justification!: string;

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

        .cancellation-text {
          font-size: var(--etools-font-size-17, 17px);
          white-space: pre-wrap;
          color: var(--primary-text-color);
          padding-top: 26px;
          padding-bottom: 26px;
          padding-inline-end: 12px;
          padding-inline-start: 80px;
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
        }
      </style>
      <etools-content-panel class="cancellation-tab" panel-title="Cancellation Note">
        <div slot="panel-btns" class="bookmark">
          <etools-icon name="bookmark"></etools-icon>
        </div>

        <div class="cancellation-text">${this.justification}</div>
      </etools-content-panel>
    `;
  }
}

window.customElements.define('cancel-justification', CancelJustification);
