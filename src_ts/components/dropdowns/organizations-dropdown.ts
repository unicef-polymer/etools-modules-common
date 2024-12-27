import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown.js';
import {EtoolsLogger} from '@unicef-polymer/etools-utils/dist/singleton/logger';
import {EtoolsDropdownEl} from '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown.js';
import {LitElement, html} from 'lit';
import {property, query, customElement} from 'lit/decorators.js';

import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {EtoolsUser} from '@unicef-polymer/etools-types';
import {isEmptyObject} from '@unicef-polymer/etools-utils/dist/equality-comparisons.util';
import {RequestEndpoint, sendRequest} from '@unicef-polymer/etools-utils/dist/etools-ajax/ajax-request';
import {toolbarDropdownStyles} from '@unicef-polymer/etools-unicef/src/styles/toolbar-dropdown-styles';
import {getTranslationIfAvailable, translateIfAvailable} from '../../utils/language';

/**
 * @LitElement
 * @customElement
 */
@customElement('organizations-dropdown')
export class organizationsDropdown extends LitElement {
  @property({type: Object})
  changeOrganizationEndpoint!: RequestEndpoint;

  @property({type: Number})
  currentOrganizationId!: number | null;

  @property({type: String, attribute: 'organizations-profile-key'})
  organizationsProfileKey = 'organizations_available';

  @property({type: String, attribute: 'organization-profile-key'})
  organizationProfileKey = 'organization';

  @property({type: String, attribute: 'option-label'})
  optionLabel = 'name';

  @property({type: String, attribute: 'option-value'})
  optionValue = 'id';

  @property({type: Array})
  organizations: any[] = [];

  @property({type: Object})
  profile!: EtoolsUser;

  public render() {
    return html`
      ${toolbarDropdownStyles}
      <etools-dropdown
        transparent
        ?hidden=${isEmptyObject(this.organizations)}
        id="organizationSelector"
        placeholder="${translateIfAvailable('SELECT_ORGANIZATION', 'Select organization')}"
        class="w100 ${this.checkMustSelectOrganization()}"
        .selected="${this.currentOrganizationId}"
        allow-outside-scroll
        no-label-float
        .options="${this.organizations}"
        .optionLabel="${this.optionLabel}"
        .optionValue="${this.optionValue}"
        trigger-value-change-event
        @etools-selected-item-changed="${this.onOrganizationChange}"
        hide-search
        min-width="160px"
        placement="bottom-end"
        .syncWidth="${false}"
        auto-width
      ></etools-dropdown>
    `;
  }

  @query('#organizationSelector') private organizationSelectorDropdown!: EtoolsDropdownEl;

  public connectedCallback() {
    super.connectedCallback();
  }

  updated(changedProps: any) {
    if (changedProps.has('profile')) {
      this.organizations = (this.profile as any)[this.organizationsProfileKey];
      this.currentOrganizationId = (this.profile as any)[this.organizationProfileKey]?.id || null;
    }
  }

  checkMustSelectOrganization() {
    if (this.profile && !(this.profile as any)[this.organizationProfileKey]) {
      setTimeout(() => {
        fireEvent(this, 'toast', {text: getTranslationIfAvailable('SELECT_ORGANIZATION', 'Select organization')});
      }, 2000);
      return 'warning';
    }
    return '';
  }

  protected onOrganizationChange(e: CustomEvent) {
    if (!e.detail.selectedItem) {
      return;
    }

    const selectedOrganizationId = parseInt(e.detail.selectedItem.id, 10);

    if (selectedOrganizationId !== this.currentOrganizationId) {
      // send post request to change_organization endpoint
      this.triggerOrganizationChangeRequest(selectedOrganizationId);
    }
  }

  protected triggerOrganizationChangeRequest(selectedOrganizationId: number) {
    fireEvent(this, 'global-loading', {
      message: 'Please wait while organization data is changing...',
      active: true,
      loadingSource: 'organization-change'
    });

    if (this.changeOrganizationEndpoint) {
      sendRequest({
        endpoint: this.changeOrganizationEndpoint,
        method: 'POST',
        body: {[this.organizationProfileKey]: selectedOrganizationId}
      })
        .then(() => {
          fireEvent(this, 'organization-changed', {[this.organizationProfileKey]: selectedOrganizationId});
        })
        .catch((error: any) => {
          this._handleError(error);
        });
    } else {
      fireEvent(this, 'organization-changed', {[this.organizationProfileKey]: selectedOrganizationId});
    }
  }

  protected _handleError(error: any) {
    EtoolsLogger.error('organization change failed!', 'organization-dropdown', error);
    this.organizationSelectorDropdown.selected = this.currentOrganizationId;
    fireEvent(this, 'toast', {text: 'Something went wrong changing your organization. Please try again'});
    fireEvent(this, 'global-loading', {
      active: false,
      loadingSource: 'organization-change'
    });
  }
}
