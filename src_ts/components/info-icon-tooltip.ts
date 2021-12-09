import {LitElement, html, property, customElement, css} from 'lit-element';
import {unsafeHTML} from 'lit-html/directives/unsafe-html';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {callClickOnEnterPushListener} from '@unicef-polymer/etools-modules-common/dist/utils/common-methods';
import {createPopper, Placement} from "@popperjs/core";

@customElement('info-icon-tooltip')
export class InfoIconTooltip extends LitElement {
  static get styles() {
    return [
      elevationStyles,
      css`
        #info-icon {
          color: var(--primary-color);
        }

        #tooltip {
          padding: 20px;
          display: none;
          background-color: #ffffff;
          width: auto;
          z-index: 9999;
        }

        #tooltip[data-show] {
          display: block;
        }

        .tooltip-info {
          padding: 6px;
          margin: 10px 0px;
          box-sizing: border-box;
          font-size: var(--iit-font-size, 14px);
          color: var(--primary-text-color);
          line-height: 22px;
          font-weight: bold;
          user-select: text;
        }

        .tooltip-info.gray-border {
          border: solid 1px var(--secondary-background-color);
        }
        iron-icon {
          margin: var(--iit-margin, 0);
          width: var(--iit-icon-size, 24px);
          height: var(--iit-icon-size, 24px);
        }
        #close-link {
          font-weight: bold;
          top: 8px;
          right: 10px;
          font-size: 12px;
          position: absolute;
          color: var(--primary-color);
          text-decoration: none;
        }
      `
    ];
  }

  render() {
    // language=HTML
    return html`
      <style>
        :host {
          display: inline-block;
          cursor: pointer;
        }
      </style>

        <iron-icon tabindex="0" id="info-icon" aria-describedby="tooltip" icon="info-outline" @click="${this.showTooltip}"></iron-icon>

        <div id="tooltip" role="tooltip" class="elevation" elevation="1">
          <a id="close-link" href="#" @click="${this.close}"> Close</a>
          <div class="tooltip-info gray-border">${unsafeHTML(this.tooltipText)}</div>
        </div>
    `;
  }

  @property({type: String})
  tooltipText = '';

  @property({type: String})
  position = 'right';

  @property({type: String})
  offset = 14;

  private tooltipHandler: any;
  private popperInstance: any;
  private tooltipEl: any;

  connectedCallback() {
    super.connectedCallback();

    setTimeout(() => {
      callClickOnEnterPushListener(this.shadowRoot?.querySelector('#info-icon'));
      this.setTooltip();
    }, 200);
  }

  setTooltip() {
     const iconEl = this.shadowRoot?.querySelector('#info-icon');
     this.tooltipEl = this.shadowRoot?.querySelector('#tooltip');
     this.popperInstance = createPopper(iconEl!, this.tooltipEl, {placement: this.position as Placement,
     modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, this.offset],
      },
    },
    ],});
  }

  showTooltip() {
    this.tooltipEl.setAttribute('data-show', '');
    this.popperInstance.update();

    this.tooltipHandler = this.hideTooltip.bind(this);
    document.addEventListener('click', this.tooltipHandler, true);
  }

  hideTooltip() {
    this.tooltipEl.removeAttribute('data-show');
    document.removeEventListener('click', this.tooltipHandler);
  }

  close(e: PointerEvent) {
    e.preventDefault();
    this.hideTooltip();
  }

}
