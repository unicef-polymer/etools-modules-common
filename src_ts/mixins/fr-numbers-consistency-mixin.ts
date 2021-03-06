import {LitElement, property} from 'lit-element';
import {displayCurrencyAmount} from '@unicef-polymer/etools-currency-amount-input/mixins/etools-currency-module';
import {Constructor, InterventionListData} from '@unicef-polymer/etools-types';
import {Fr, FrsDetails, Intervention} from '@unicef-polymer/etools-types';

function FrNumbersConsistencyMixin<T extends Constructor<LitElement>>(baseClass: T) {
  class FrNumbersConsistencyClass extends baseClass {
    @property({type: Object})
    frsConsistencyWarnings = {
      amountsCannotBeCompared: 'FRs Amount and UNICEF Cash Contribution can not be compared.',
      tooManyFrsCurencies: 'More than 1 FR currency is available.',
      amountAndDisbursementNotDisplayed: 'Totals for FR amount and Actual Disbursement can not be displayed.',
      currencyMismatch: 'FR currency does not match PD/SPD currency.',
      cannotCalcDisbursement: 'Disbursement to Date % can not calculate.',
      addedFrsCurrenciesMismatch:
        'The currency of the PD/SPD and the FR are not the same and cannot be ' +
        'compared.\nTo be able to compare the amounts, you can cancel and enter the budget in the same currency ' +
        'as the FR.\n',
      amount: 'Total FR amount is not the same as planned UNICEF Cash Contribution.',
      dateTmpl: 'FR <<field_name>> is not the same as PD/SPD <<field_name>>.',
      warningTmpl: 'The <<frs_fields>> <<verb>> not the same as PD/SPD <<pd_fields>>.',
      FCmultiCurrFlagErrorMsg: 'There are multiple transaction currencies in VISION'
    };
    @property({type: Object})
    frsValidationFields = {
      start_date: 'Start Date',
      end_date: 'End Date',
      pd_unicef_cash_contribution: 'UNICEF Cash Contribution',
      fr_earliest_date: 'FR Start Date',
      fr_latest_date: 'FR End Date',
      fr_total_amount: 'Total FR amount'
    };

    /*
     * frs currencies and planned budget currency check
     */
    _frsAndPlannedBudgetCurrenciesMatch(frs: Fr[], plannedBudgetCurrency: string) {
      const differentFrCurrencies = frs.filter((fr) => fr.currency !== plannedBudgetCurrency);
      return differentFrCurrencies.length === 0;
    }

    /**
     * Check for currency mismatch in frs list
     */
    _frsCurrenciesMatch(frs: Fr[]) {
      const firstFrCurrency = frs[0].currency;
      const diff = frs.filter((fr) => fr.currency !== firstFrCurrency);
      return diff.length === 0;
    }

    /**
     * Check FR numbers total amount against planned budget unicef total contribution and start/end dates
     */
    checkFrsConsistency(frsDetails: FrsDetails, intervention: Intervention, skipEmptyListCheck?: boolean) {
      if (intervention.status === 'closed') {
        return false;
      }

      const warnFrsFields = []; // FR fields
      const warnIntervFields = []; // PD/SPD fields
      if (this.checkFrsAndIntervDateConsistency(intervention.start, frsDetails.earliest_start_date)) {
        warnFrsFields.push(this.frsValidationFields.fr_earliest_date);
        warnIntervFields.push(this.frsValidationFields.start_date);
      }
      if (this.checkFrsAndIntervDateConsistency(intervention.end, frsDetails.latest_end_date)) {
        warnFrsFields.push(this.frsValidationFields.fr_latest_date);
        warnIntervFields.push(this.frsValidationFields.end_date);
      }

      let computedWarning = '';
      // check frs currencies and planned budget currency match
      if (this._frsAndPlannedBudgetCurrenciesMatch(frsDetails.frs, intervention.planned_budget!.currency as string)) {
        // currencies are the same => check amounts consistency
        if (
          this.checkFrsAndUnicefCashAmountsConsistency(
            intervention.planned_budget!.unicef_cash_local as string,
            frsDetails.total_frs_amt as unknown as string,
            intervention,
            'interventionMetadata',
            false,
            skipEmptyListCheck
          )
        ) {
          warnFrsFields.push(this.frsValidationFields.fr_total_amount);
          warnIntervFields.push(this.frsValidationFields.pd_unicef_cash_contribution);
        }
      } else {
        // currencies of the frs and planned budget do NOT match
        computedWarning = this.frsConsistencyWarnings.addedFrsCurrenciesMismatch;
      }

      if (warnFrsFields.length > 0) {
        computedWarning += this.frsConsistencyWarnings.warningTmpl;
        computedWarning = this._buildFrsWarningMsg(computedWarning, '<<frs_fields>>', warnFrsFields.join(', '));
        computedWarning = this._buildFrsWarningMsg(
          computedWarning,
          '<<verb>>',
          warnFrsFields.length > 1 ? 'are' : 'is'
        );
        computedWarning = this._buildFrsWarningMsg(computedWarning, '<<pd_fields>>', warnIntervFields.join(', '));
      }
      return computedWarning !== '' ? computedWarning : false;
    }

    checkFrsAndUnicefCashAmountsConsistency(
      unicefCash: string,
      frsTotalAmt: string,
      intervention: Intervention,
      interventionIsFromWhere: string,
      returnMsg: boolean,
      skipEmptyListCheck?: boolean
    ) {
      if (
        !this.validateFrsVsUnicefCashAmounts(
          unicefCash,
          frsTotalAmt,
          intervention,
          interventionIsFromWhere,
          skipEmptyListCheck
        )
      ) {
        return returnMsg ? this.getFrsTotalAmountInconsistencyMsg() : true;
      }
      return '';
    }

    /**
     * skipEmptyListCheck - skip required when in the process of adding a new FR number
     */
    validateFrsVsUnicefCashAmounts(
      unicefCash: string,
      frsTotalAmt: string,
      intervention: Intervention,
      interventionIsFromWhere: string,
      skipEmptyListCheck?: boolean
    ) {
      if (
        intervention.status === 'closed' ||
        (!skipEmptyListCheck && this.emptyFrsList(intervention as any, interventionIsFromWhere as any))
      ) {
        return true;
      }
      const totalUnicefContribution = parseFloat(unicefCash);
      const totalFrsAmount = parseFloat(frsTotalAmt);

      return totalUnicefContribution === totalFrsAmount;
    }

    checkFrsAndIntervDateConsistency(
      intervDateStr: string,
      frsDateStr: string | null,
      fieldName?: string,
      returnMsg?: boolean
    ) {
      if (!this.validateFrsVsInterventionDates(intervDateStr, frsDateStr)) {
        return returnMsg
          ? this._buildFrsWarningMsg(this.frsConsistencyWarnings.dateTmpl, '<<field_name>>', fieldName as string)
          : true;
      }
      return false;
    }

    validateFrsVsInterventionDates(intervDateStr: string, frsDateStr: string | null) {
      if (!frsDateStr || !intervDateStr) {
        // No Fr added or interv dates not set yet
        return true;
      }
      return intervDateStr === frsDateStr;
    }

    _buildFrsWarningMsg(msgTemplate: string, searchStr: string, replacementStr: string) {
      return msgTemplate.replace(new RegExp(searchStr, 'g'), replacementStr);
    }

    getFrsTotalAmountInconsistencyMsg() {
      return this.frsConsistencyWarnings.amount;
    }

    getFrsStartDateValidationMsg() {
      return this._buildFrsWarningMsg(
        this.frsConsistencyWarnings.dateTmpl,
        '<<field_name>>',
        this.frsValidationFields.start_date
      );
    }

    getFrsEndDateValidationMsg() {
      return this._buildFrsWarningMsg(
        this.frsConsistencyWarnings.dateTmpl,
        '<<field_name>>',
        this.frsValidationFields.end_date
      );
    }

    frsConsistencyWarningIsActive(active: boolean | string) {
      return !!active;
    }

    emptyFrsList(intervention: Intervention, interventionIsFromWhere: 'interventionMetadata'): boolean;
    emptyFrsList(intervention: InterventionListData, interventionIsFromWhere: 'interventionsList'): boolean;
    emptyFrsList(intervention: any, interventionIsFromWhere: string) {
      // * The intervention object from interventions-list
      // has different properties than the one on intervention-metadata
      switch (interventionIsFromWhere) {
        case 'interventionMetadata':
          return !intervention || !intervention.frs_details || intervention.frs_details.frs.length === 0;
        case 'interventionsList':
          return !intervention.frs_earliest_start_date || !intervention.frs_latest_end_date;
        default:
          return true;
      }
    }

    getFrsCurrency(frsCurrencyMatch: boolean, frs: Fr[]) {
      return frsCurrencyMatch ? frs[0].currency : 'N/A';
    }

    getFrsTotal(frsCurrencyMatch: boolean, totalAmt: string, negateCurrencyMatchFlagFirst?: boolean) {
      frsCurrencyMatch = negateCurrencyMatchFlagFirst ? !frsCurrencyMatch : frsCurrencyMatch;
      return frsCurrencyMatch ? displayCurrencyAmount(totalAmt, '0.00') : 'N/A';
    }

    allCurrenciesMatch(frsCurrencyMatch: boolean, frs: Fr[], plannedBudgetCurrency: string) {
      return frsCurrencyMatch && this._frsAndPlannedBudgetCurrenciesMatch(frs, plannedBudgetCurrency);
    }

    hideFrCurrencyTooltip(frsCurrencyMatch: boolean, frCurrency: string, plannedBudgetCurrency?: string) {
      return !frsCurrencyMatch ? frCurrency === plannedBudgetCurrency : true;
    }

    hideFrsAmountTooltip(
      frsCurrencyMatch: boolean,
      frs: any,
      plannedBudgetCurrency: string,
      frsTotalAmountWarning: string
    ) {
      const allCurrenciesMatch = this.allCurrenciesMatch(frsCurrencyMatch, frs, plannedBudgetCurrency);
      return !allCurrenciesMatch || !frsTotalAmountWarning;
    }

    getFrsCurrencyTooltipIcon(frsCurrencyMatch: boolean) {
      if (!frsCurrencyMatch) {
        return 'pmp-custom-icons:1+';
      }
      return 'pmp-custom-icons:not-equal';
    }

    getFrsValueNAClass(valIsAvailable: boolean, negateFlagValFirst?: boolean) {
      const isAvailable = negateFlagValFirst ? !valIsAvailable : valIsAvailable;
      return isAvailable ? '' : 'fr-val-not-available';
    }

    getFrsCurrencyTooltipMsg(frsCurrencyMatch: boolean) {
      const tooManyCurrenciesMsg =
        this.frsConsistencyWarnings.tooManyFrsCurencies +
        '\n' +
        this.frsConsistencyWarnings.amountAndDisbursementNotDisplayed;
      return !frsCurrencyMatch ? tooManyCurrenciesMsg : this.frsConsistencyWarnings.currencyMismatch;
    }

    getFrCurrencyTooltipMsg() {
      return this.frsConsistencyWarnings.currencyMismatch + '\n' + this.frsConsistencyWarnings.cannotCalcDisbursement;
    }

    /**
     * Check if all currencies are consistent by the flag received from API
     * If allCurrenciesAreConsistent is undefined or null => PD has not FRs added
     * @param allCurrenciesAreConsistent
     * @return {boolean}
     */
    _allCurrenciesAreConsistent(allCurrenciesAreConsistent: any) {
      return typeof allCurrenciesAreConsistent === 'boolean' ? allCurrenciesAreConsistent : true;
    }

    hideIntListUnicefCashAmountTooltip(
      allCurrenciesAreConsistent: any,
      unicefCash: string,
      frsTotalAmt: string,
      intervention: Intervention
    ) {
      const consistentCurrencies = this._allCurrenciesAreConsistent(allCurrenciesAreConsistent);
      if (consistentCurrencies) {
        return this.validateFrsVsUnicefCashAmounts(unicefCash, frsTotalAmt, intervention, 'interventionsList');
      }
      return false;
    }

    getCurrencyMismatchClass(allCurrenciesAreConsistent: any) {
      return this._allCurrenciesAreConsistent(allCurrenciesAreConsistent) ? '' : 'currency-mismatch';
    }

    getIntListUnicefCashAmountTooltipMsg(allCurrenciesAreConsistent: any, frsCurrenciesAreConsistent: boolean) {
      if (this._allCurrenciesAreConsistent(allCurrenciesAreConsistent)) {
        return this.getFrsTotalAmountInconsistencyMsg();
      }
      const msg = !frsCurrenciesAreConsistent
        ? this.frsConsistencyWarnings.tooManyFrsCurencies
        : this.frsConsistencyWarnings.currencyMismatch;
      return msg + '\n' + this.frsConsistencyWarnings.amountsCannotBeCompared;
    }

    getFrsMultiCurrFlagErrTooltipMsg() {
      return this.frsConsistencyWarnings.FCmultiCurrFlagErrorMsg;
    }
  }

  return FrNumbersConsistencyClass;
}

export default FrNumbersConsistencyMixin;
