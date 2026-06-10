``` abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '[BP] 고객 거래 누계 Projection View'
@Metadata.ignorePropagatedAnnotations: true
define view entity ZC102_P_BP_CUSTOMER_TOTAL
  as projection on ZC102_R_BP_CUSTOMER_TOTAL
{
  key Bukrs,
  key Gjahr,
  key Partner,
  key Monat,
      @Semantics.amount.currencyCode: 'Waers'
      Wrbtr,
      @Semantics.currencyCode: true
      Waers,
      /* Associations */
      _BP : redirected to parent ZC102_P_BP_BP_CREATE
}
