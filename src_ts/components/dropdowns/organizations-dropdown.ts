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
        option-label="name"
        option-value="id"
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
      this.organizations = this.profile.organizations_available;
      this.currentOrganizationId = this.profile.organization?.id || null;
    }
  }

  checkMustSelectOrganization() {
    if (this.profile && !this.profile.organization) {
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

    sendRequest({
      endpoint: this.changeOrganizationEndpoint,
      method: 'POST',
      body: {organization: selectedOrganizationId}
    })
      .then(() => {
        fireEvent(this, 'organization-changed', {organization: selectedOrganizationId});
      })
      .catch((error: any) => {
        this._handleError(error);
      });
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
