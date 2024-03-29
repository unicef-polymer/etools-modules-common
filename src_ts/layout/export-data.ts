import {customElement, html, LitElement, property, css} from 'lit-element';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-menu-button/paper-menu-button';
import '@polymer/iron-icon/iron-icon';
import '@polymer/paper-listbox/paper-listbox';
import {AnyObject} from '@unicef-polymer/etools-types';
import {elevation2} from '../styles/elevation-styles';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {translate, get as getTranslation} from 'lit-translate';

/**
 * @customElement
 * @LitElement
 */
@customElement('export-data')
export class ExportData extends LitElement {
  static get styles() {
    return [
      css`
        paper-menu-button {
          padding: 0px 24px;
        }
        paper-button {
          height: 40px;
          padding: 0px 5px;
          margin-inline-start: 10px;
          font-weight: bold;
          color: var(--secondary-text-color);
        }

        paper-button iron-icon {
          margin-inline-end: 10px;
          color: var(--secondary-text-color);
        }

        paper-button:focus {
          ${elevation2}
        }

        paper-item:hover {
          cursor: pointer;
        }
      `
    ];
  }
  public render() {
    return html`
      <style>
        #pdExportMenuBtn {
          /* Prevent first item highlighted by default */
          --paper-item-focused-before: {
            background: none;
            opacity: 0;
          }
          --paper-item-focused-after: {
            background: none;
            opacity: 0;
          }
        }
      </style>
      <paper-menu-button id="pdExportMenuBtn" close-on-activate horizontal-align="right">
        <paper-button slot="dropdown-trigger" class="dropdown-trigger">
          <iron-icon icon="file-download"></iron-icon>
          ${translate('EXPORT')}
        </paper-button>
        <paper-listbox slot="dropdown-content">
          ${this.exportLinks.map(
            (item) => html` <paper-item @tap="${() => this.export(item.type)}">${item.name}</paper-item>`
          )}
        </paper-listbox>
      </paper-menu-button>
    `;
  }

  @property({type: Array})
  exportLinks: AnyObject[];

  @property({type: String})
  params = '';

  @property({type: String})
  endpoint = '';

  constructor() {
    super();
    this.exportLinks = [
      {
        name: getTranslation('EXPORT_XLS'),
        type: 'xlsx'
      },
      {
        name: getTranslation('EXPORT_CSV'),
        type: 'csv'
      }
    ];
  }

  export(_type: string) {
    // const url = this.endpoint + `export/${_type}/` + (this.params ? `?${this.params}` : '');
    // Export not implemented yet
    // window.open(url, '_blank');
    fireEvent(this, 'toast', {text: 'Export not implemented...'});
  }
}
