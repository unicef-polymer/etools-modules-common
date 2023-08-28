import {LitElement} from 'lit';
import {property} from 'lit/decorators.js';
import {displayCurrencyAmount} from '@unicef-polymer/etools-unicef/src/utils/currency';
import {Constructor, InterventionListData} from '@unicef-polymer/etools-types';
import {Fr, FrsDetails, Intervention} from '@unicef-polymer/etools-types';
import {get as getTranslation} from 'lit-translate';

function FrNumbersConsistencyMixin<T extends Constructor<LitElement>>(baseClass: T) {
  class FrNumbersConsistencyClass extends baseClass {
    @property({type: Object})
    frNumbersMessageKeys = {
      amountsCannotBeCompared: 'FRNUMBERSCONSISTENCY.AMOUNTSCANNOTBECOMPARED',
      tooManyFrsCurencies: 'FRNUMBERSCONSISTENCY.TOOMANYFRSCURENCIES',
      amountAndDisbursementNotDisplayed: 'FRNUMBERSCONSISTENCY.AMOUNTANDDISBURSEMENTNOTDISPLAYED',
      currencyMismatch: 'FRNUMBERSCONSISTENCY.CURRENCYMISMATCH',
      cannotCalcDisbursement: 'FRNUMBERSCONSISTENCY.CANNOTCALCDISBURSEMENT',
      addedFrsCurrenciesMismatch: 'FRNUMBERSCONSISTENCY.ADDEDFRSCURRENCIESMISMATCH',
      amount: 'FRNUMBERSCONSISTENCY.AMOUNT',
      dateTmpl: 'FRNUMBERSCONSISTENCY.DATETMPL',
      warningTmpl: 'FRNUMBERSCONSISTENCY.WARNINGTMPL',
      FCmultiCurrFlagErrorMsg: 'FRNUMBERSCONSISTENCY.FCMULTICURRFLAGERRORMSG',
      start_date: 'FRNUMBERSCONSISTENCY.START_DATE',
      end_date: 'FRNUMBERSCONSISTENCY.END_DATE',
      pd_unicef_cash_contribution: 'FRNUMBERSCONSISTENCY.PD_UNICEF_CASH_CONTRIBUTION',
      fr_earliest_date: 'FRNUMBERSCONSISTENCY.FR_EARLIEST_DATE',
      fr_latest_date: 'FRNUMBERSCONSISTENCY.FR_LATEST_DATE',
      fr_total_amount: 'FRNUMBERSCONSISTENCY.FR_TOTAL_AMOUNT'
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
        warnFrsFields.push(getTranslation(this.frNumbersMessageKeys.fr_earliest_date));
        warnIntervFields.push(getTranslation(this.frNumbersMessageKeys.start_date));
      }
      if (this.checkFrsAndIntervDateConsistency(intervention.end, frsDetails.latest_end_date)) {
        warnFrsFields.push(getTranslation(this.frNumbersMessageKeys.fr_latest_date));
        warnIntervFields.push(getTranslation(this.frNumbersMessageKeys.end_date));
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
          warnFrsFields.push(getTranslation(this.frNumbersMessageKeys.fr_total_amount));
          warnIntervFields.push(getTranslation(this.frNumbersMessageKeys.pd_unicef_cash_contribution));
        }
      } else {
        // currencies of the frs and planned budget do NOT match
        computedWarning = getTranslation(this.frNumbersMessageKeys.addedFrsCurrenciesMismatch);
      }

      if (warnFrsFields.length > 0) {
        computedWarning += getTranslation(this.frNumbersMessageKeys.warningTmpl);
        computedWarning = this._buildFrsWarningMsg(computedWarning, '<<frs_fields>>', warnFrsFields.join(', '));
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
          ? this._buildFrsWarningMsg(
              getTranslation(this.frNumbersMessageKeys.dateTmpl),
              '<<field_name>>',
              fieldName as string
            )
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
      return getTranslation(this.frNumbersMessageKeys.amount);
    }

    getFrsStartDateValidationMsg() {
      return this._buildFrsWarningMsg(
        getTranslation(this.frNumbersMessageKeys.dateTmpl),
        '<<field_name>>',
        getTranslation(this.frNumbersMessageKeys.start_date)
      );
    }

    getFrsEndDateValidationMsg() {
      return this._buildFrsWarningMsg(
        getTranslation(this.frNumbersMessageKeys.dateTmpl),
        '<<field_name>>',
        getTranslation(this.frNumbersMessageKeys.end_date)
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
        getTranslation(this.frNumbersMessageKeys.tooManyFrsCurencies) +
        '\n' +
        getTranslation(this.frNumbersMessageKeys.amountAndDisbursementNotDisplayed);
      return !frsCurrencyMatch ? tooManyCurrenciesMsg : getTranslation(this.frNumbersMessageKeys.currencyMismatch);
    }

    getFrCurrencyTooltipMsg() {
      return (
        getTranslation(this.frNumbersMessageKeys.currencyMismatch) +
        '\n' +
        getTranslation(this.frNumbersMessageKeys.cannotCalcDisbursement)
      );
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
        ? getTranslation(this.frNumbersMessageKeys.tooManyFrsCurencies)
        : getTranslation(this.frNumbersMessageKeys.currencyMismatch);
      return msg + '\n' + getTranslation(this.frNumbersMessageKeys.amountsCannotBeCompared);
    }

    getFrsMultiCurrFlagErrTooltipMsg() {
      return getTranslation(this.frNumbersMessageKeys.FCmultiCurrFlagErrorMsg);
    }
  }

  return FrNumbersConsistencyClass;
}

export default FrNumbersConsistencyMixin;
