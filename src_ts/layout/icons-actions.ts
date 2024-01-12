import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-icon-button/etools-icon-button';
import {AnyObject} from '@unicef-polymer/etools-types';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';

/**
 * @customElement
 */
@customElement('icons-actions')
export class IconsActions extends LitElement {
  render() {
    return html`
      <style>
        [hidden] {
          display: none !important;
        }

        :host {
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
          -ms-flex-direction: row;
          -webkit-flex-direction: row;
          flex-direction: row;
          -ms-flex-align: center;
          -webkit-align-items: center;
          align-items: center;
          background-color: var(--list-second-bg-color);
          position: absolute;
          inset-inline-end: 0;
          top: 0;
          bottom: 0;
        }

        etools-icon-button {
          color: var(--dark-icon-color, #6f6f70);
        }
      </style>

      <etools-icon-button ?hidden="${!this.showEdit}" name="create" @click="${this._onEdit}"></etools-icon-button>
      <etools-icon-button ?hidden="${!this.showDelete}" name="delete" @click="${this._onDelete}"></etools-icon-button>
      <etools-icon-button
        ?hidden="${!this.showDeactivate}"
        name="block"
        @click="${this._onDeactivate}"
      ></etools-icon-button>
    `;
  }

  @property({type: Object})
  itemDetails!: AnyObject;

  @property({type: Boolean})
  showEdit = true;

  @property({type: Boolean})
  showDelete = true;

  @property({type: Boolean})
  showDeactivate = false;

  _onEdit() {
    fireEvent(this, 'edit');
  }

  _onDelete() {
    fireEvent(this, 'delete');
  }

  _onDeactivate() {
    fireEvent(this, 'deactivate');
  }
}
