import {html, LitElement, TemplateResult} from 'lit';
import {property, customElement} from 'lit/decorators.js';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-textarea.js';
import {sharedStyles} from '../../styles/shared-styles-lit';

@customElement('reason-popup')
export class ReasonPopup extends LitElement {
  @property() dialogOpened = true;
  @property() popupTitle = '';
  @property() label = '';
  @property() reason = '';
  @property() error = '';

  set dialogData({popupTitle, label}: any) {
    this.popupTitle = popupTitle;
    this.label = label;
  }

  render(): TemplateResult | void {
    return html`
      ${sharedStyles}
      <style>
        .container {
          padding: 15px 20px;
        }

        etools-dialog::part(ed-scrollable) {
          margin-top: 0 !important;
        }
      </style>
      <etools-dialog
        id="dialog"
        size="md"
        no-padding
        keep-dialog-open
        ?opened="${this.dialogOpened}"
        .okBtnText="Confirm"
        dialog-title="${this.popupTitle}"
        @close="${this.onClose}"
        @confirm-btn-clicked="${() => this.confirmReason()}"
      >
        <div class="container">
          <etools-textarea
            id="details-input"
            .value="${this.reason}"
            required
            label="${this.label}"
            placeholder="—"
            @value-changed="${({detail}: CustomEvent) => (this.reason = detail.value)}"
            @focus="${() => (this.error = '')}"
            ?invalid="${Boolean(this.error)}"
            error-message="${this.error}"
          ></etools-textarea>
        </div>
      </etools-dialog>
    `;
  }

  onClose(): void {
    fireEvent(this, 'dialog-closed', {confirmed: false});
  }

  confirmReason(): void {
    if (!this.reason.trim()) {
      this.error = 'Field is required';
      return;
    }
    fireEvent(this, 'dialog-closed', {confirmed: true, response: {comment: this.reason}});
  }
}
