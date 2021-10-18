import {html} from 'lit-element';

export const InfoElementStyles = html`
  <style>
    :host {
      display: block;
      margin-bottom: 24px;
    }
    section {
      display: flex !important;
    }
    table {
      display: flex;
      position: relative;
      justify-content: flex-start;
      padding: 0 24px;
      flex-wrap: wrap;
    }
    .data-column {
      margin: 14px 0;
      min-width: 140px;
      max-width: max-content;
      padding: 0 5px;
      box-sizing: border-box;
    }
    .data-column > div {
      display: flex;
      padding-top: 4px;
    }
    .input-label {
      padding-top: 0;
      display: flex;
      align-items: center;
    }
    .not-allowed,
    .not-allowed label {
      cursor: not-allowed !important;
    }

    .icon-tooltip-div {
      width: 24px;
      padding-top: 7px;
      padding-right: 10px;
    }

    info-icon-tooltip {
      color: var(--primary-color);
      cursor: pointer;
    }
  </style>
`;
