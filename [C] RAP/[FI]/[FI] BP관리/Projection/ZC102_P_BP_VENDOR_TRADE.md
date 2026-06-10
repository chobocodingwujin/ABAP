``` abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '[BP] 벤더-자재 구매 누계 Projection view'
@Metadata.ignorePropagatedAnnotations: true
define view entity ZC102_P_BP_VENDOR_TRADE
  as projection on ZC102_R_BP_VENDOR_TRADE
{
  key Partner as Partner,
      Matnr   as Matnr,
      @Semantics.quantity.unitOfMeasure: 'Meins'
      Menge,
      Meins   as Meins,
      @Semantics.amount.currencyCode: 'Waers'
      Stprs,
      Waers   as Waers,
      TYear,
      Monat,
      /* Associations */
      _BP : redirected to parent ZC102_P_BP_BP_CREATE
}
