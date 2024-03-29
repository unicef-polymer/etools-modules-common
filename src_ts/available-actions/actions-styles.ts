import {css, CSSResult} from 'lit-element';

// language=css
export const ActionsStyles: CSSResult = css`
  :host {
    display: flex;
    flex-direction: row;
    --green-color: #009688;
    --light-green-color: #00b3a1;
    --back-color: #233944;
    --cancel-color: #828282;
  }

  .main-button {
    height: 36px;
    padding: 0 18px;
    color: white;
    background: var(--green-color);
    font-weight: 500;
  }

  .back-button {
    background: var(--back-color);
  }

  .back-button span {
    margin-inline-start: 10px;
  }

  .cancel-background {
    background: var(--cancel-color);
  }

  .reject-button {
    background: var(--reject-color);
  }

  .main-button.with-additional {
    padding: 0;
    padding-inline-start: 18px;
  }

  .main-button span {
    margin-inline-end: 7px;
  }

  .other-options {
    padding: 10px 24px;
    color: var(--primary-text-color);
    white-space: nowrap;
  }

  .other-options:hover {
    background-color: var(--secondary-background-color);
  }

  paper-menu-button {
    padding: 8px 2px;
  }

  paper-button {
    z-index: 10;
  }
  .option-button {
    margin-inline-start: 14px;
    height: 36px;
    border-inline-start: 2px solid rgba(255, 255, 255, 0.12);
  }
`;
