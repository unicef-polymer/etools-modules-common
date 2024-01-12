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

  etools-dropdown-multi[required]::part(esmm-label),
  etools-dropdown[required]::part(esmm-label) {
    background: url('./images/required.svg') no-repeat 99% 20%/8px;
    width: auto !important;
    max-width: 100%;
    inset-inline-end: auto;
    padding-inline-end: 15px;
  }

  html[dir='rtl'] etools-dropdown-multi[required]::part(esmm-label),
  html[dir='rtl'] etools-dropdown[required]::part(esmm-label) {
    background: url('./images/required.svg') no-repeat 0 20%/8px;
    inset-inline-end: auto;
    padding-inline-end: 15px;
  }
</style>`;