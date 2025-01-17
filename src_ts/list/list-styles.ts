import {css, CSSResult} from 'lit';

// language=CSS
export const InterventionsListStyles: CSSResult = css`
  etools-table {
    padding-top: 12px;
  }

  .shortAddText {
    display: none;
  }

  .action {
    text-align: right;
  }

  @media (max-width: 576px) {
    .action {
      text-align: right;
    }

    #addBtn {
      padding-inline-end: 16px;
      margin-inline-end: 32px;
    }

    .shortAddText {
      display: block;
    }

    .longAddText {
      display: none;
    }
  }
`;

// language=CSS
export const InterventionsTableStyles: CSSResult = css`
  .details {
    display: flex;
  }
  .details > div {
    margin-inline-end: 40px;
  }
  .title {
    margin-bottom: 5px;
    font-weight: 500;
    font-size: var(--etools-font-size-12, 12px);
    line-height: 20px;
    color: rgba(0, 0, 0, 0.54);
  }
  .detail {
    font-size: var(--etools-font-size-13, 13px);
    line-height: 15px;
    color: rgba(0, 0, 0, 0.87);
  }
  td[data-label='Doc Type'],
  td[data-label='Start Date'],
  td[data-label='End Date'],
  th {
    white-space: nowrap;
  }
  td[data-label='Doc Type'] {
    width: 100px;
  }
  td[data-label='Title'],
  td[data-label='Partner Org Name'] {
    width: 27%;
  }
`;
