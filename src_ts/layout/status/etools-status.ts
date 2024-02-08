import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import {listenForLangChanged, translate, translateConfig} from 'lit-translate';

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
          font-size: var(--etools-font-size-16, 16px);
          margin-bottom: 22px;
        }

        .status:not(:last-of-type)::after {
          content: '';
          display: inline-block;
          vertical-align: middle;
          width: 40px;
          height: 1px;
          margin-inline-end: 16px;
          margin-inline-start: 24px;
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
          margin-inline-end: 8px;
          margin-inline-start: 8px;
          font-size: var(--etools-font-size-14, 14px);
          line-height: 24px;
        }

        .status.active .icon {
          background-color: var(--primary-color);
        }

        .status.completed .icon {
          background-color: var(--success-color);
          fill: #ffffff;
        }
        etools-icon {
          --etools-icon-font-size: var(--etools-font-size-20, 20px);
          vertical-align: baseline;
          padding: 2px;
        }
      </style>
      ${this.statuses.map((item: any, index: number) => this.getStatusHtml(item, index, activeStatusIndex))}
    `;
  }

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
    const completed = this.isCompleted(index, activeStatusIndex);
    // if status is terminated..we do not show active, and reverse
    // @lajos: this should be refactored to something better
    if (this.activeStatus == 'terminated') {
      if (this.statuses.length - 1 == index) {
        // special icon for terminated status
        return html`
          <div class="status ${this.getStatusClasses(index, activeStatusIndex)}">
            <etools-icon class="custom-icon" style="color: #ea4022" name="report-problem"> </etools-icon>
            <span class="label"
              >${translate(`PD_STATUS.${item[1].toUpperCase()}`, undefined, {
                ...translateConfig,
                empty: () => item[1]
              } as any)}</span
            >
          </div>
        `;
      }
    }

    return html`
      <div class="status ${this.getStatusClasses(index, activeStatusIndex)}">
        <span class="icon">
          ${completed
            ? html`<etools-icon name="done"></etools-icon>`
            : html`${this.getBaseOneIndex(index)}`}
        </span>
        <span class="label">
          ${translate(`PD_STATUS.${item[1].toUpperCase()}`, undefined, {
            ...translateConfig,
            empty: () => item[1]
          } as any)}</span
        >
      </div>
    `;
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

  getStatusClasses(index: number, activeStatusIndex: number): string {
    const classes: string[] = [];
    if (index === activeStatusIndex) {
      classes.push('active');
    }
    if (this.isCompleted(index, activeStatusIndex)) {
      classes.push('completed');
    }
    return classes.join(' ');
  }
}
