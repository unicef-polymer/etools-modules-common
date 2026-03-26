import {LitElement, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';

import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import {SlTab} from '@shoelace-style/shoelace';

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
          min-width: 100%;
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
        sl-tab[is-subtabs-parent] > sl-dropdown > etools-button {
          color: var(--secondary-text-color);
        }
        sl-tab[active][is-subtabs-parent] > sl-dropdown > etools-button {
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
        ${repeat(
          this._tabs,
          (item) => item.id,
          (item) => {
            if (item.subtabs) {
              return this.getSubtabs(item);
            } else {
              return this.getTabHtml(item);
            }
          }
        )}
      </sl-tab-group>
    `;
  }

  @state()
  _activeTab = '';
  @property({type: String})
  set activeTab(value: string) {
    if (value === undefined || this._activeTab === value) {
      return;
    }

    this._activeTab = value;
    this.activeSubTab = '';

    this.shadowRoot?.querySelector('sl-tab-group')?.show(this.activeTab);
    this.requestUpdate();
    this.updateIndicator();
  }

  get activeTab() {
    return this._activeTab;
  }

  @property({type: String})
  activeSubTab = '';

  @state()
  _tabs!: any[];
  @property({type: Array})
  set tabs(value: any) {
    this._tabs = value;
    this.updateIndicator();
  }

  get tabs() {
    return this._tabs;
  }

  timeout: any = null;

  async connectedCallback() {
    super.connectedCallback();
    document.addEventListener('language-changed', this.handleLanguageChange.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('language-changed', this.handleLanguageChange.bind(this));
  }

  handleLanguageChange() {
    this.updateIndicator();
  }

  handleTabChange(e: CustomEvent) {
    const newTabName: string = e.detail.name;
    this.setActiveTab(newTabName);
  }

  setActiveTab(activeTabName: string) {
    if (activeTabName === this.activeTab) {
      return;
    }

    this.activeTab = activeTabName;
  }

  updateIndicator() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    // Get time needed for any css transition to finish
    const transitionValue = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--sl-transition-fast')
    );

    // Wait to finish rendering the text in the final form(after translations/applying styles/etc)
    // so we get the final accurate width of each tab
    this.timeout = setTimeout(() => {
      // Update the tab blue indicator
      this.shadowRoot?.querySelector('sl-tab-group')?.syncIndicator();
      // Once the indicator has finished transitioning to the new width and position
      // we can check to see if we need to hide or show the arrow control buttons
      setTimeout(() => {
        this.shadowRoot?.querySelector('sl-tab-group')?.updateScrollControls();
      }, transitionValue);

      if (this.activeTab) {
        // reset active tab, if have dynamic tabs control will wrongly store active tab
        const tab: SlTab | null | undefined = this.shadowRoot?.querySelector('sl-tab[active]');
        if (tab) {
          tab.click();
        }
      }
    }, transitionValue);
  }

  getTabHtml(item: any) {
    return html`
      <sl-tab
        slot="nav"
        panel="${item.tab}"
        ?active="${this.activeTab && this.activeTab === item.tab}"
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
        ?active="${this.activeTab && this.activeTab === item.tab}"
        ?hidden="${item.hidden}"
        @keyup=${this.callClickOnEnterSpaceDownKeys}
      >
        <sl-dropdown id="subtabmenu" horizontal-align="right" vertical-offset="45">
          <etools-button class="button" slot="trigger" caret> ${item.tabLabel} </etools-button>
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
    return this.activeSubTab && dropdownItemValue == this.activeSubTab;
  }

  callClickOnEnterSpaceDownKeys(event: KeyboardEvent) {
    if (['Enter', ' ', 'ArrowDown'].includes(event.key) && !event.ctrlKey) {
      // Cancel the default action, if needed
      event.preventDefault();

      // @ts-ignore
      if (event.target!.localName !== 'sl-tab') {
        return;
      }
      ((event.target as any).querySelector('etools-button') as any).click();
    }
  }
}
