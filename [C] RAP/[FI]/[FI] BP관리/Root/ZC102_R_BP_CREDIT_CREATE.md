``` abap
@AbapCatalog.viewEnhancementCategory: [#NONE]
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '[BP] 여신 생성'
@Metadata.ignorePropagatedAnnotations: true
@ObjectModel.usageType:{
    serviceQuality: #X,
    sizeCategory: #S,
    dataClass: #MIXED
}
define view entity ZC102_R_BP_CREDIT_CREATE
  as select from zc102fit0008         as a
    left outer join   ZC102_BP_CREDIT_USED as b on a.partner = b.partner
  association to parent ZC102_R_BP_BP_CREATE as _BP on $projection.Partner = _BP.Partner
{
  key a.partner      as Partner,
      @Semantics.amount.currencyCode: 'Waers'
      a.credit_limit as CreditLimit,
      @Semantics.amount.currencyCode: 'Waers'
      b.credit_used  as CreditUsed,
      a.waers        as Waers,
      @Semantics.systemDateTime.lastChangedAt: true
      a.last_updated as LastUpdated,

      _BP
}
