import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown';

import {html, LitElement, TemplateResult} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {use} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {parseRequestErrorsAndShowAsToastMsgs} from '@unicef-polymer/etools-utils/dist/etools-ajax/ajax-error-parser';
import {toolbarDropdownStyles} from '@unicef-polymer/etools-unicef/src/styles/toolbar-dropdown-styles';
import {EtoolsUser} from '@unicef-polymer/etools-types';
import 'dayjs/locale/fr.js';
import 'dayjs/locale/ru.js';
import 'dayjs/locale/pt.js';
import 'dayjs/locale/ar.js';
import 'dayjs/locale/ro.js';
import 'dayjs/locale/es.js';
import dayjs from 'dayjs';
import {RequestEndpoint, sendRequest} from '@unicef-polymer/etools-utils/dist/etools-ajax';
/**
 * @LitElement
 * @customElement
 */
@customElement('languages-dropdown')
export class LanguagesDropdown extends LitElement {
  @property({type: Object})
  availableLanguages?: any[];

  @property()
  activeLanguage?: string;

  @property({type: Object})
  profile!: EtoolsUser;

  @property({type: Object})
  changeLanguageEndpoint!: RequestEndpoint;

  @property({type: String, attribute: 'option-label'})
  optionLabel = 'display_name';

  @property({type: String, attribute: 'option-value'})
  optionValue = 'value';

  @state()
  selectedLanguage!: string;

  @state()
  initialLanguage!: string;

  @state()
  langUpdateInProgress = false;

  constructor() {
    super();
  }

  render(): TemplateResult {
    // main template
    // language=HTML
    return html`
      ${toolbarDropdownStyles}
      <!-- shown options limit set to 250 as there are currently 195 countries in the UN council and about 230 total -->
      <etools-dropdown
        transparent
        .selected="${this.selectedLanguage}"
        .options="${this.availableLanguages}"
        .optionLabel="${this.optionLabel}"
        .optionValue="${this.optionValue}"
        @etools-selected-item-changed="${this.languageChanged}"
        trigger-value-change-event
        hide-search
        allow-outside-scroll
        no-label-float
        .disabled="${this.langUpdateInProgress}"
        min-width="120px"
        placement="bottom-end"
        .syncWidth="${false}"
      ></etools-dropdown>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
  }

  updated(changedProps: any) {
    if (changedProps.has('activeLanguage')) {
      if (this.activeLanguage && this.activeLanguage !== this.selectedLanguage) {
        this.selectedLanguage = this.activeLanguage;
        (window as any).EtoolsLanguage = this.selectedLanguage;
        this.initialLanguage = this.selectedLanguage;
        this.setLanguageDirection();
      }
    }
  }

  private setLanguageDirection() {
    setTimeout(() => {
      const htmlTag = document.querySelector('html');
      if (this.selectedLanguage === 'ar') {
        htmlTag!.setAttribute('dir', 'rtl');
        this.setAttribute('dir', 'rtl');
        this.dir = 'rtl';
      } else if (htmlTag!.getAttribute('dir')) {
        htmlTag!.removeAttribute('dir');
        this.removeAttribute('dir');
        this.dir = '';
      }
    });
  }

  languageChanged(e: CustomEvent): void {
    if (!e.detail.selectedItem) {
      return;
    }

    const newLanguage = e.detail.selectedItem.value;
    if (newLanguage) {
      dayjs.locale(newLanguage);
      // Event caught by self translating npm packages
      fireEvent(this, 'language-changed', {language: newLanguage});
    }
    if (newLanguage !== this.selectedLanguage) {
      (window as any).EtoolsLanguage = newLanguage;
      use(newLanguage).then(() => {
        if (this.profile?.preferences?.language != newLanguage) {
          this.updateUserPreference(newLanguage);
        }
      });
    }
  }

  private updateUserPreference(language: string) {
    if (this.changeLanguageEndpoint) {
      sendRequest({endpoint: this.changeLanguageEndpoint, method: 'PATCH', body: {preferences: {language: language}}})
        .then((response) => {
          fireEvent(this, 'user-language-changed', {language, user: response});
        })
        .catch((err: any) => parseRequestErrorsAndShowAsToastMsgs(err, this));
    } else {
      fireEvent(this, 'user-language-changed', {language});
    }
  }
}
