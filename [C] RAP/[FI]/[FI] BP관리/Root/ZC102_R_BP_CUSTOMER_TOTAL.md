``` abap
@AbapCatalog.viewEnhancementCategory: [#NONE]
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '[BP] 고객 거래 누계'
@Metadata.ignorePropagatedAnnotations: true
@ObjectModel.usageType:{
    serviceQuality: #X,
    sizeCategory: #S,
    dataClass: #MIXED
}
define view entity ZC102_R_BP_CUSTOMER_TOTAL
  as select from ZC102_R_BP_CUSTOMER_MONTHLY as a
  association to parent ZC102_R_BP_BP_CREATE as _BP on $projection.Partner = _BP.Partner
{
  key a.Bukrs,
  key a.Gjahr,
  key a.Partner,
  key a.Monat,
      @Semantics.amount.currencyCode: 'Waers'
      sum(a.Wrbtr) as Wrbtr,
      a.Waers,
      _BP
}
group by
  a.Bukrs,
  a.Gjahr,
  a.Partner,
  a.Monat,
  a.Waers
