import {css, unsafeCSS} from 'lit';
export const buttonsStylesContent = `
  sl-button.default.left-icon:not(variant=["text"])::part(base),
  sl-button.primary.left-icon:not(variant=["text"])::part(base),
  sl-button.info.left-icon:not(variant=["text"])::part(base),
  sl-button.success.left-icon:not(variant=["text"])::part(base),
  sl-button.error.left-icon:not(variant=["text"])::part(base) {
    padding-inline-end: 12px;
  }

  sl-button.default.right-icon:not(variant=["text"])::part(base),
  sl-button.primary.right-icon:not(variant=["text"])::part(base),
  sl-button.info.right-icon:not(variant=["text"])::part(base),
  sl-button.success.right-icon:not(variant=["text"])::part(base),
  sl-button.error.right-icon:not(variant=["text"])::part(base) {
    padding-inline-start: 12px;
  }

  sl-button.default.left-icon etools-icon,
  sl-button.primary.left-icon etools-icon,
  sl-button.success.left-icon etools-icon,
  sl-button.error.left-icon etools-icon {
    margin-inline-end: 10px;
  }

  sl-button.info.left-icon etools-icon {
    margin-inline-end: 4px;
  }

  sl-button.default.right-icon etools-icon,
  sl-button.primary.right-icon etools-icon,
  sl-button.info.right-icon etools-icon,
  sl-button.success.right-icon etools-icon,
  sl-button.error.right-icon etools-icon {
    margin-inline-start: 10px;
  }

  sl-button.default:not(variant=["text"])::part(base) {
    color: var(--default-btn-color, #ffffff);
    background-color: var(--default-btn-bg-color, rgba(0, 0, 0, 0.45));
  }

  sl-button.primary:not(variant=["text"])::part(base) {
    color: var(--primary-btn-color, #ffffff);
    background-color: var(--primary-btn-bg-color, var(--primary-color));
  }

  sl-button.info:not(variant=["text"])::part(base) {
    color: var(--primary-color, #0099ff);
    align-self: center;
  }

  sl-button.success:not(variant=["text"])::part(base) {
    color: var(--success-btn-color, #ffffff);
    background-color: var(--success-btn-bg-color, var(--success-color));
  }

  sl-button.error:not(variant=["text"])::part(base) {
    color: var(--error-btn-color, #ffffff);
    background-color: var(--error-btn-bg-color, var(--error-color));
  }

  sl-button .btn-label {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .secondary-btn:not(variant=["text"])::part(base) {
    width: auto;
    margin: 0;
    color: var(--primary-color);
    padding: 0;
    padding-inline-end: 5px;
    font-size: 14px;
    font-weight: bold;
  }

  .primary-btn:not(variant=["text"])::part(base) {
    --sl-color-primary-600: var(--primary-color);
    color: var(--light-primary-text-color, #fff);
  }

  .error:not(variant=["text"])::part(base) {
    --sl-color-primary-600: var(--error-color);
    --sl-color-primary-500: var(--error-color);
    color: var(--light-primary-text-color, #fff);
  }
  
  .save-cancel-btns sl-button:not(variant=["text"])::part(base) {
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


  sl-button.export:not(variant=["text"])::part(base) {
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

  sl-button.default:not(variant=["text"])::part(base) {
    --sl-color-primary-600: var(--default-btn-bg-color,  #9D9D9D);
    --sl-color-primary-500: var(--default-btn-bg-color,  #9D9D9D);
  }


`;
// language=HTML
export const buttonsStyles = css`
  ${unsafeCSS(buttonsStylesContent)}
`;
