import {css, unsafeCSS} from 'lit';
export const buttonsStylesContent = `
  paper-button.default,
  paper-button.primary,
  paper-button.info,
  paper-button.success,
  paper-button.error {
    padding: 6px 8px;
    font-weight: 500;
    letter-spacing: 0.5px;
  }

  paper-button.default.left-icon,
  paper-button.primary.left-icon,
  paper-button.info.left-icon,
  paper-button.success.left-icon,
  paper-button.error.left-icon {
    padding-inline-end: 12px;
  }

  paper-button.default.right-icon,
  paper-button.primary.right-icon,
  paper-button.info.right-icon,
  paper-button.success.right-icon,
  paper-button.error.right-icon {
    padding-inline-start: 12px;
  }

  paper-button.default.left-icon iron-icon,
  paper-button.primary.left-icon iron-icon,
  paper-button.success.left-icon iron-icon,
  paper-button.error.left-icon iron-icon {
    margin-inline-end: 10px;
  }

  paper-button.info.left-icon iron-icon {
    margin-inline-end: 4px;
  }

  paper-button.default.right-icon iron-icon,
  paper-button.primary.right-icon iron-icon,
  paper-button.info.right-icon iron-icon,
  paper-button.success.right-icon iron-icon,
  paper-button.error.right-icon iron-icon {
    margin-inline-start: 10px;
  }

  paper-button.default {
    color: var(--default-btn-color, #ffffff);
    background-color: var(--default-btn-bg-color, rgba(0, 0, 0, 0.45));
  }

  paper-button.primary {
    color: var(--primary-btn-color, #ffffff);
    background-color: var(--primary-btn-bg-color, var(--primary-color));
  }

  paper-button.info {
    color: var(--primary-color, #0099ff);
    align-self: center;
  }

  paper-button.success {
    color: var(--success-btn-color, #ffffff);
    background-color: var(--success-btn-bg-color, var(--success-color));
  }

  paper-button.error {
    color: var(--error-btn-color, #ffffff);
    background-color: var(--error-btn-bg-color, var(--error-color));
  }

  paper-button .btn-label {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .secondary-btn {
    width: auto;
    margin: 0;
    color: var(--primary-color);
    padding: 0;
    padding-inline-end: 5px;
    font-size: 14px;
    font-weight: bold;
  }
  .primary-btn {
    --sl-color-primary-600: var(--primary-color);
    color: var(--light-primary-text-color, #fff);
  }

  .error {
    --sl-color-primary-600: var(--error-color);
    --sl-color-primary-500: var(--error-color);
    color: var(--light-primary-text-color, #fff);
  }
  
  .save-cancel-btns sl-button {
    min-width: 82px;
  }

  sl-button::part(label) {
    text-transform: uppercase;
  }
  sl-button {
    --sl-button-font-size-medium: 16px;
    --sl-input-height-medium: 36px;
    margin-inline-start: 15px;
  }

  sl-button[variant='text'] {
    --sl-button-font-size-medium: 14px;
  }

  sl-button[variant='text']::part(label) {
    font-weight: 700;
  }

  sl-button.no-pad {
    --sl-spacing-medium: 0;
  }
  sl-button.no-marg {
    margin:0;
  }


  sl-button.export::part(base) {
    --sl-color-primary-600: var(--dark-secondary-text-color);
    text-transform: uppercase;
    font-weight: 600;
  }
  sl-button.export::part(label) {
    padding-inline-start: 5px;
    padding-inline-end: 5px;
  }

  sl-button[variant='text'].cancel {
    --sl-color-primary-600: var(--primary-text-color, rgba(0,0,0,0.87));
  }

  sl-button.default {
    --sl-color-primary-600: var(--default-btn-bg-color,  #9D9D9D);
    --sl-color-primary-500: var(--default-btn-bg-color,  #9D9D9D);
  }


`;
// language=HTML
export const buttonsStyles = css`
  ${unsafeCSS(buttonsStylesContent)}
`;
