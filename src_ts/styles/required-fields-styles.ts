import {html} from 'lit';
export const RequiredFieldsStyles = html`<style>
  label[required] {
    background: url('./images/required.svg') no-repeat 87% 40%/6px;
    width: auto !important;
    max-width: 100%;
    right: auto;
    padding-inline-end: 15px;
  }
  :host-context([dir='rtl']) *[required] {
    background: url('./images/required.svg') no-repeat 0 20%/8px;
    right: auto;
    padding-inline-end: 15px;
  }

  datepicker-lite[required],
  etools-upload[required] {
    --paper-input-container-label: {
      @apply --required-star-style;
      color: var(--secondary-text-color, #737373);
    }
    --paper-input-container-label-floating: {
      @apply --required-star-style;
      color: var(--secondary-text-color, #737373);
    }
  }
  etools-dropdown-multi[required]::part(esmm-label),
  etools-dropdown[required]::part(esmm-label) {
    @apply --required-star-style;
  }
</style>`;
