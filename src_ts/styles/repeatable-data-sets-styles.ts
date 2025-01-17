import {html} from 'lit';

import {actionIconBtnsStyles} from './action-icon-btns-styles';

// language=HTML
export const repeatableDataSetsStyles = html` ${actionIconBtnsStyles}
  <style>
    .item-container {
      background: var(--ecp-content-bg-color, var(--primary-background-color));
    }

    .item-container.no-h-margin {
      padding-inline-end: 0;
      padding-inline-start: 0;
    }

    .item-actions-container {
      display: flex;
      flex-direction: row;
    }

    .item-actions-container .actions {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex-wrap: wrap;
    }

    .item-container .item-content {
      display: flex;
      flex-direction: column;
      flex: 1;
      margin-inline-start: 10px;
      border-inline-start: 1px solid var(--darker-divider-color);
    }

    .item-container .item-content > * {
      padding: 0 0 16px 0;
      padding-inline-start: 24px;
    }

    #bottom-actions {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      overflow: visible;
      padding-top: 15px;
      padding-bottom: 25px;
    }
  </style>`;

// language=HTML
export const repeatableDataSetsStylesV2 = html` <style>
  .item-container {
    padding: 8px 25px;
  }

  .item-actions-container {
    position: relative;
    padding-inline-end: 10px;
    border-inline-end: 2px solid var(--primary-color);
    margin-top: 25px;
  }

  .item-actions-container:before {
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: absolute;
    top: -32px;
    inset-inline-end: -12px;
    background-color: var(--primary-color);
    color: var(--light-primary-text-color);
    content: attr(data-item-nr);
    text-align: center;
    font-size: var(--etools-font-size-12, 12px);
    width: 24px;
    height: 24px;
    border-radius: 50%;
    z-index: 1;
  }

  .item-actions-container.locked {
    border-inline-start-color: var(--darker-divider-color);
  }

  .item-actions-container.locked:before {
    background-color: var(--darker-divider-color);
  }

  .item-container .item-content {
    display: inline-block;
    width: 100%;
    margin-inline-start: 0;
    border-inline-start: none;
  }
</style>`;

// language=HTML
export const repeatableDataSetsStylesV3 = html` <style>
  .item-container {
    background-color: var(--medium-theme-background-color);
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    margin-bottom: 20px;
    padding: 15px;
  }

  .item-container:last-of-type {
    margin-bottom: 0;
  }

  .item-container .item-content {
    border-inline-start-style: dashed;
  }

  .item-content > * {
    margin-bottom: 0;
  }

  .add-btn-wrapper {
    padding-top: 15px;
    padding-bottom: 15px;
  }
</style>`;
