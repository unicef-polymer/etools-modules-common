import {css, unsafeCSS} from 'lit';
export const frWarningsContent = `
etools-info-tooltip.fr-nr-warn etools-icon {
  color: var(--error-color);
  cursor: default;
}

etools-info-tooltip.currency-mismatch etools-icon {
  color: var(--primary-color);
}

etools-info-tooltip.frs-inline-list etools-icon {
  --etools-icon-fill-color: var(--error-color);
  color: var(--error-color);
  margin-inline-start: 24px !important;
}

.fr-val-not-available {
  color: var(--secondary-text-color);
}

.amount-currency {
  margin-inline-end: 4px;
}

`;
export const frWarningsStyles = css`
  ${unsafeCSS(frWarningsContent)}
`;
export const frWarningsStylesPolymer = () => {
  const template = document.createElement('template');
  template.innerHTML = `<style>
    ${frWarningsContent}
   </style>`;
  return template;
};
