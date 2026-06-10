``` abap
@AbapCatalog.viewEnhancementCategory: [#NONE]
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '[BP] 벤더-자재 구매 누계'
@Metadata.ignorePropagatedAnnotations: true
@ObjectModel.usageType:{
    serviceQuality: #X,
    sizeCategory: #S,
    dataClass: #MIXED
}
define view entity ZC102_R_BP_VENDOR_TRADE
  as select from ZC102_R_BP_VENDOR_MONTHLY
  association to parent ZC102_R_BP_BP_CREATE as _BP on $projection.Partner = _BP.Partner
{
      //key VbelnBil,
  key Partner    as Partner,
      //key Ebeln   as Ebeln,
      Matnr      as Matnr,
      @Semantics.quantity.unitOfMeasure: 'Meins'
      sum(Menge) as Menge,
      Meins      as Meins,
      @Semantics.amount.currencyCode: 'Waers'
      sum(Stprs) as Stprs,
      Waers      as Waers,
      TYear,
      Monat,

      _BP
}
group by
  Monat,
  TYear,
  Waers,
  Meins,
  Partner,
  Matnr
