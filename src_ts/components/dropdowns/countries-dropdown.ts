import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown.js';
import {RequestEndpoint, sendRequest} from '@unicef-polymer/etools-utils/dist/etools-ajax/ajax-request';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util.js';
import {EtoolsLogger} from '@unicef-polymer/etools-utils/dist/singleton/logger';
import {EtoolsDropdownEl} from '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown.js';
import {EtoolsUser} from '@unicef-polymer/etools-types';
import {html, LitElement} from 'lit';
import {property} from 'lit/decorators.js';
import {toolbarDropdownStyles} from '@unicef-polymer/etools-unicef/src/styles/toolbar-dropdown-styles';
import {getTranslationIfAvailable, translateIfAvailable} from '../../utils/language';

/**
 * @LitElement
 * @customElement
 * @mixinFunction
 * @appliesMixin EndpointsMixin
 * @appliesMixin EtoolsPageRefreshMixin
 */
class CountriesDropdown extends LitElement {
  @property({type: Object})
  profile!: EtoolsUser;

  @property({type: String, attribute: 'countries-profile-key'})
  countriesProfileKey = 'countries_available';

  @property({type: String, attribute: 'country-profile-key'})
  countryProfileKey = 'country';

  @property({type: String, attribute: 'option-label'})
  optionLabel = 'name';

  @property({type: String, attribute: 'option-value'})
  optionValue = 'id';

  @property({type: Object})
  changeCountryEndpoint!: RequestEndpoint;

  @property({type: Object})
  selectionValidator: (newCountryId: number, previousCountryId: number) => boolean = () => true;

  get countries() {
    return (
      (this.profile as any)?.[this.countriesProfileKey]?.sort((a: any, b: any) =>
        a[this.optionLabel].localeCompare(b[this.optionLabel])
      ) || []
    );
  }

  get country() {
    return (this.profile as any)?.[this.countryProfileKey];
  }

  render() {
    // main template
    // language=HTML
    return html`
      ${toolbarDropdownStyles}
      <style>
        *[hidden] {
          display: none !important;
        }

        :host {
          display: block;
        }

        :host(:hover) {
          cursor: pointer;
        }

        :host-context([dir='rtl']) etools-dropdown {
          --paper-input-container-shared-input-style: {
            color: var(--light-secondary-text-color);
            cursor: pointer;
            font-size: var(--etools-font-size-16, 16px);
            text-align: left;
            width: 100px;
          };
        }
      </style>
      <!-- shown options limit set to 250 as there are currently 195 countries in the UN council and about 230 total -->
      <etools-dropdown
        transparent
        id="countrySelector"
        class="w100"
        .selected="${this.country?.id}"
        placeholder="${translateIfAvailable('COUNTRY', 'Country')}"
        allow-outside-scroll
        no-label-float
        .options="${this.countries}"
        .optionLabel="${this.optionLabel}"
        .optionValue="${this.optionValue}"
        trigger-value-change-event
        @etools-selected-item-changed="${this._countrySelected}"
        .shownOptionsLimit="${280}"
        hide-search
        min-width="160px"
        placement="bottom-end"
        .syncWidth="${false}"
      ></etools-dropdown>
    `;
  }

  public connectedCallback() {
    super.connectedCallback();
  }

  protected async _countrySelected(e: any) {
    if (!e.detail.selectedItem) {
      return;
    }

    const selectedCountryId = parseInt(e.detail.selectedItem.id, 10);

    if (selectedCountryId !== this.country?.id) {
      const prevCountryId = this.country?.id;
      this.profile = {
        ...this.profile,
        [this.countryProfileKey]: {
          ...this.country,
          id: selectedCountryId
        }
      };
      if (!(await this.selectionValidator(selectedCountryId, this.country?.id))) {
        this.profile = {
          ...this.profile,
          [this.countryProfileKey]: {
            ...this.country,
            id: prevCountryId
          }
        };
        return;
      }

      this._triggerCountryChangeRequest(selectedCountryId);
    }
  }

  protected _triggerCountryChangeRequest(countryId: any) {
    fireEvent(this, 'global-loading', {
      message: 'Please wait while country data is changing...',
      active: true,
      loadingSource: 'country-change'
    });

    if (this.changeCountryEndpoint) {
      sendRequest({
        endpoint: this.changeCountryEndpoint,
        method: 'POST',
        body: {[this.countryProfileKey]: countryId}
      })
        .then(() => {
          fireEvent(this, 'country-changed', {[this.countryProfileKey]: countryId});
        })
        .catch((error: any) => {
          this._handleError(error);
        });
    } else {
      fireEvent(this, 'country-changed', {[this.countryProfileKey]: countryId});
    }
  }

  protected _handleError(error: any) {
    EtoolsLogger.error('Country change failed!', 'countries-dropdown', error);
    (this.shadowRoot?.querySelector('#countrySelector') as EtoolsDropdownEl).selected = this.country?.id;
    fireEvent(this, 'toast', {
      text: getTranslationIfAvailable(
        'ERROR_CHANGE_WORKSPACE',
        'Something went wrong changing your workspace. Please try again'
      )
    });
    fireEvent(this, 'global-loading', {
      active: false,
      loadingSource: 'country-change'
    });
  }
}

window.customElements.define('countries-dropdown', CountriesDropdown);
