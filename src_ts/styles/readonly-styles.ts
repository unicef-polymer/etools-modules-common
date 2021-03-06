import {html} from 'lit-element';

export const ReadonlyStyles = html`<style>
  etools-dropdown[readonly],
  etools-dropdown-multi[readonly],
  datepicker-lite[readonly],
  paper-input[readonly],
  paper-input-container[readonly],
  paper-textarea[readonly],
  etools-currency-amount-input[readonly] {
    --paper-input-container-underline: {
      display: none;
    }
    --paper-input-container-input-focus: {
      pointer-events: none;
    }
    --paper-input-container-label-focus: {
      pointer-events: none;
      color: var(--secondary-text-color);
    }
    --paper-input-container-underline-focus: {
      display: none;
    }
    --paper-input-container: {
      pointer-events: none;
      cursor: default;
    }
    --paper-input-container-label: {
      pointer-events: none;
      color: var(--secondary-text-color, #737373);
      cursor: default;
    }
    --esmm-select-cursor: text;
    --esmm-external-wrapper: {
      width: 100%;
    }
  }

  paper-textarea-with-icon[readonly] {
    --paper-input-container-underline: {
      display: none;
    }
    --paper-input-container-input-focus: {
      pointer-events: none;
    }
    --paper-input-container-label-focus: {
      color: var(--secondary-text-color);
    }
    --paper-input-container-underline-focus: {
      display: none;
    }
    --paper-input-container: {
      cursor: default;
    }
    --paper-input-container-label: {
      color: var(--secondary-text-color, #737373);
      cursor: default;
    }
    --esmm-select-cursor: text;
    --esmm-external-wrapper: {
      width: 100%;
    }
  }

  .readonly {
    pointer-events: none;
  }
</style> `;
