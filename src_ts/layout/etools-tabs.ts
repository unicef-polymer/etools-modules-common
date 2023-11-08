import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {AnyObject} from '@unicef-polymer/etools-types';

import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';

/**
 * @LitElement
 * @customElement
 */

@customElement('etools-tabs-lit')
export class EtoolsTabs extends LitElement {
  public render() {
    // main template
    // language=HTML
    return html`
      <style>
        *[hidden] {
          display: none !important;
        }

        sl-tab[disabled] {
          opacity: 0.3;
        }

        *[disabled] {
          cursor: not-allowed !important;
          pointer-events: auto !important;
        }

        :host {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
        }

        :host([border-bottom]) {
          border-bottom: 1px solid var(--dark-divider-color);
        }

        sl-tab-group {
          width: 100%;
        }

        sl-tab-group::part(tabs) {
          border-bottom-color: transparent;
        }

        sl-tab {
          padding: 0 24px;
        }

        sl-tab::part(base) {
          color: var(--secondary-text-color);
          text-transform: uppercase;
          opacity: 0.8;
          min-width: 120px;
          text-align: center;
        }

        sl-tab[link]::part(base) {
          color: var(--primary-color);
        }

        sl-tab[active]::part(base) {
          color: var(--primary-color);
        }

        sl-tab[is-subtabs-parent]::part(base) {
          opacity: 1 !important;
          cursor: pointer !important;
        }
        sl-tab[is-subtabs-parent] > sl-dropdown > sl-button {
          color: var(--secondary-text-color);
        }
        sl-tab[active][is-subtabs-parent] > sl-dropdown > sl-button {
          color: var(--primary-color) !important;
        }

        sl-tab::part(base):focus-visible {
          outline: 0;
          opacity: 1;
          font-weight: 700;
        }

        @media print {
          :host {
            display: none;
          }
        }
      </style>

      <sl-tab-group id="tabs" @sl-tab-show="${this.handleTabChange}">
        ${this.tabs.map((item) => {
          if (item.subtabs) {
            return this.getSubtabs(item);
          } else {
            return this.getTabHtml(item);
          }
        })}
      </sl-tab-group>
    `;
  }

  @property({type: String})
  activeTab = '';

  @property({type: String})
  activeSubTab = '';

  @property({type: Array})
  tabs!: AnyObject[];

  handleTabChange(e: CustomEvent) {
    const newTabName: string = e.detail.panel;
    this.setActiveTab(newTabName);
  }

  setActiveTab(activeTabName: string) {
    if (activeTabName === this.activeTab) {
      return;
    }

    this.activeTab = activeTabName;
    this.activeSubTab = '';
    setTimeout(() => this.shadowRoot?.querySelector('sl-tab-group')?.syncIndicator(), 150);
  }

  getTabHtml(item: any) {
    return html`
      <sl-tab
        slot="nav"
        panel="${item.tab}"
        ?active="${this.activeTab === item.tab}"
        ?hidden="${item.hidden}"
        ?disabled="${item.disabled}"
      >
        ${item.tabLabel} ${item.showTabCounter ? html`(${item.counter})` : ''}
      </sl-tab>
    `;
  }

  getSubtabs(item: any) {
    return html`
      <sl-tab
        style="overflow: visible !important;"
        slot="nav"
        panel="${item.tab}"
        is-subtabs-parent="true"
        link
        ?active="${this.activeTab === item.tab}"
        ?hidden="${item.hidden}"
        @keyup=${this.callClickOnEnterSpaceDownKeys}
      >
        <sl-dropdown id="subtabmenu" horizontal-align="right" vertical-offset="45">
          <sl-button class="button" slot="trigger" caret> ${item.tabLabel} </sl-button>
          <sl-menu>
            ${item.subtabs.map(
              (subitem: any) => html`
                <sl-menu-item
                  name="${item.tab}"
                  subtab="${subitem.value}"
                  @click=${(e: Event) => {
                    this.activeSubTab = subitem.value;
                    if ((e.target as any).checked) {
                      e.preventDefault();
                      e.stopImmediatePropagation();
                    }
                  }}
                  type="checkbox"
                  ?checked="${this.isSelectedSubtab(subitem.value)}"
                >
                  ${subitem.label}
                </sl-menu-item>
              `
            )}
          </sl-menu>
        </sl-dropdown>
      </sl-tab>
    `;
  }

  isSelectedSubtab(dropdownItemValue: string) {
    return dropdownItemValue == this.activeSubTab;
  }

  callClickOnEnterSpaceDownKeys(event: KeyboardEvent) {
    if (['Enter', ' ', 'ArrowDown'].includes(event.key) && !event.ctrlKey) {
      // Cancel the default action, if needed
      event.preventDefault();

      // @ts-ignore
      if (event.target!.localName !== 'sl-tab') {
        return;
      }
      ((event.target as any).querySelector('sl-button') as any).click();
    }
  }
}
