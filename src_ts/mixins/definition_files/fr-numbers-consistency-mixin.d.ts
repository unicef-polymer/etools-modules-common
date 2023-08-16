import {Constructor, InterventionListData} from '@unicef-polymer/etools-types';
import {Fr, FrsDetails, Intervention} from '@unicef-polymer/etools-types';
import {EtoolsCurrency} from '@unicef-polymer/etools-currency-amount-input/mixins/etools-currency-mixin';
import {LitElement} from 'lit';
declare function FrNumbersConsistencyMixin<T extends Constructor<LitElement>>(
  baseClass: T
): {
  new (...args: any[]): {
    frNumbersMessageKeys: {
      amountsCannotBeCompared: string;
      tooManyFrsCurencies: string;
      amountAndDisbursementNotDisplayed: string;
      currencyMismatch: string;
      cannotCalcDisbursement: string;
      addedFrsCurrenciesMismatch: string;
      amount: string;
      dateTmpl: string;
      warningTmpl: string;
      FCmultiCurrFlagErrorMsg: string;
      start_date: string;
      end_date: string;
      pd_unicef_cash_contribution: string;
      fr_earliest_date: string;
      fr_latest_date: string;
      fr_total_amount: string;
    };
    _frsAndPlannedBudgetCurrenciesMatch(frs: Fr[], plannedBudgetCurrency: string): boolean;
    /**
     * Check for currency mismatch in frs list
     */
    _frsCurrenciesMatch(frs: Fr[]): boolean;
    /**
     * Check FR numbers total amount against planned budget unicef total contribution and start/end dates
     */
    checkFrsConsistency(
      frsDetails: FrsDetails,
      intervention: Intervention,
      skipEmptyListCheck?: boolean | undefined
    ): string | false;
    checkFrsAndUnicefCashAmountsConsistency(
      unicefCash: string,
      frsTotalAmt: string,
      intervention: Intervention,
      interventionIsFromWhere: string,
      returnMsg: boolean,
      skipEmptyListCheck?: boolean | undefined
    ): string | true;
    /**
     * skipEmptyListCheck - skip required when in the process of adding a new FR number
     */
    validateFrsVsUnicefCashAmounts(
      unicefCash: string,
      frsTotalAmt: string,
      intervention: Intervention,
      interventionIsFromWhere: string,
      skipEmptyListCheck?: boolean | undefined
    ): boolean;
    checkFrsAndIntervDateConsistency(
      intervDateStr: string,
      frsDateStr: string | null,
      fieldName?: string | undefined,
      returnMsg?: boolean | undefined
    ): string | boolean;
    validateFrsVsInterventionDates(intervDateStr: string, frsDateStr: string | null): boolean;
    _buildFrsWarningMsg(msgTemplate: string, searchStr: string, replacementStr: string): string;
    getFrsTotalAmountInconsistencyMsg(): string;
    getFrsStartDateValidationMsg(): string;
    getFrsEndDateValidationMsg(): string;
    frsConsistencyWarningIsActive(active: boolean | string): boolean;
    emptyFrsList(intervention: Intervention, interventionIsFromWhere: 'interventionMetadata'): boolean;
    emptyFrsList(intervention: InterventionListData, interventionIsFromWhere: 'interventionsList'): boolean;
    getFrsCurrency(frsCurrencyMatch: boolean, frs: Fr[]): string;
    getFrsTotal(frsCurrencyMatch: boolean, totalAmt: string, negateCurrencyMatchFlagFirst?: boolean | undefined): any;
    allCurrenciesMatch(frsCurrencyMatch: boolean, frs: Fr[], plannedBudgetCurrency: string): boolean;
    hideFrCurrencyTooltip(
      frsCurrencyMatch: boolean,
      frCurrency: string,
      plannedBudgetCurrency?: string | undefined
    ): boolean;
    hideFrsAmountTooltip(
      frsCurrencyMatch: boolean,
      frs: any,
      plannedBudgetCurrency: string,
      frsTotalAmountWarning: string
    ): boolean;
    getFrsCurrencyTooltipIcon(frsCurrencyMatch: boolean): 'pmp-custom-icons:1+' | 'pmp-custom-icons:not-equal';
    getFrsValueNAClass(valIsAvailable: boolean, negateFlagValFirst?: boolean | undefined): '' | 'fr-val-not-available';
    getFrsCurrencyTooltipMsg(frsCurrencyMatch: boolean): string;
    getFrCurrencyTooltipMsg(): string;
    /**
     * Check if all currencies are consistent by the flag received from API
     * If allCurrenciesAreConsistent is undefined or null => PD has not FRs added
     * @param allCurrenciesAreConsistent
     * @return {boolean}
     */
    _allCurrenciesAreConsistent(allCurrenciesAreConsistent: any): boolean;
    hideIntListUnicefCashAmountTooltip(
      allCurrenciesAreConsistent: any,
      unicefCash: string,
      frsTotalAmt: string,
      intervention: Intervention
    ): boolean;
    getCurrencyMismatchClass(allCurrenciesAreConsistent: any): '' | 'currency-mismatch';
    getIntListUnicefCashAmountTooltipMsg(allCurrenciesAreConsistent: any, frsCurrenciesAreConsistent: boolean): string;
    getFrsMultiCurrFlagErrTooltipMsg(): string;
  };
} & T &
  ReturnType<typeof EtoolsCurrency>;
export default FrNumbersConsistencyMixin;
