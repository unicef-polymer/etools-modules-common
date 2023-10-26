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

  sl-button .btn-label {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  sl-button::part(label) {
    text-transform: uppercase;
  }
  sl-button {
    --sl-button-font-size-medium: 16px;
    --sl-input-height-medium: 36px;
    --sl-spacing-medium: 8px;
    margin-inline-start: 5px;
    margin-inline-end: 5px;
    min-width: 82px;
  }

  sl-button[variant='text'] {
    --sl-button-font-size-medium: 16px;
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

  sl-button[variant='text'].neutral::part(base) {
    color: var(--sl-color-neutral-600);
  }
`;
// language=HTML
export const buttonsStyles = css`
  ${unsafeCSS(buttonsStylesContent)}
`;
