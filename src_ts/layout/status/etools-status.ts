import {LitElement, html, property, customElement} from 'lit-element';
import '@polymer/iron-icons/iron-icons';
import {completedStatusIcon} from './status-icons';
import {listenForLangChanged, translate, translateConfig} from 'lit-translate';
import {repeat} from 'lit-html/directives/repeat';
import {classMap} from 'lit-html/directives/class-map';

export type EtoolsStatusItem = [string, string];

/**
 * @LitElement
 * @customElement
 */

@customElement('etools-status-lit')
export class EtoolsStatus extends LitElement {
  public render() {
    const activeStatusIndex: number = this.activeStatus
      ? this.statuses.findIndex(([status]: EtoolsStatusItem) => status === this.activeStatus)
      : 0;

    // language=HTML
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: row;
          align-items: center;
          border-bottom: 1px solid var(--light-divider-color);
          border-top: 1px solid var(--light-divider-color);
          padding: 22px 14px 0;
          flex-wrap: wrap;
          background-color: var(--primary-background-color);
          margin-top: 4px;
          justify-content: center;
        }

        .status {
          display: flex;
          flex-direction: row;
          align-items: center;
          color: var(--secondary-text-color);
          font-size: 16px;
          margin-bottom: 22px;
        }

        .status:not(:last-of-type)::after {
          content: '';
          display: inline-block;
          vertical-align: middle;
          width: 40px;
          height: 1px;
          margin-right: 16px;
          margin-left: 24px;
          border-top: 1px solid var(--secondary-text-color);
        }

        .status .icon {
          display: inline-block;
          text-align: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          color: #fff;
          background-color: var(--secondary-text-color);
          margin-right: 8px;
          margin-left: 8px;
          font-size: 14px;
          line-height: 24px;
        }

        .status.active .icon {
          background-color: var(--primary-color);
        }

        .status.completed .icon {
          background-color: var(--success-color);
          fill: #ffffff;
        }
      </style>
      ${repeat(
        this.statuses,
        (_item) => this.activeStatus,
        (item: any, index: number) => this.getStatusHtml(item, index, activeStatusIndex)
      )}
    `;
  }

  @property({type: String})
  activeStatusIndex = 0;

  @property({type: String})
  activeStatus!: string;

  @property({type: Array})
  statuses: EtoolsStatusItem[] = [];

  constructor() {
    super();
    listenForLangChanged(() => {
      this.statuses = [...this.statuses];
    });
  }

  getStatusHtml(item: EtoolsStatusItem, index: number, activeStatusIndex: number) {
    const styleClasses = {active: index === activeStatusIndex, completed: this.isCompleted(index, activeStatusIndex)};
    return html`<div class="status ${classMap(styleClasses)}}">
      ${this.activeStatus == 'terminated'
        ? html` <iron-icon class="custom-icon" style="color: #ea4022" icon="report-problem"> </iron-icon>`
        : html`<span class="icon">
            ${this.isCompleted(index, activeStatusIndex)
              ? html`${completedStatusIcon}`
              : html`${this.getBaseOneIndex(index)}`}
          </span>`}
      <span class="label">
        ${translate(`PD_STATUS.${item[1].toUpperCase()}`, undefined, {
          ...translateConfig,
          empty: () => item[1]
        })}</span
      >
    </div>`;
  }

  /**
   * Get status icon or icon placeholder
   * @param index
   */
  getBaseOneIndex(index: number): number | string {
    return index + 1;
  }

  isCompleted(index: number, activeStatusIndex: number): boolean {
    return index < activeStatusIndex || activeStatusIndex === this.statuses.length - 1;
  }
}
