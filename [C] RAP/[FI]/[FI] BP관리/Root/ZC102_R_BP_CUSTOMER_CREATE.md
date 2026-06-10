``` abap
@AbapCatalog.viewEnhancementCategory: [#NONE]
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '[BP] 고객 생성'
@Metadata.ignorePropagatedAnnotations: true
@ObjectModel.usageType:{
    serviceQuality: #X,
    sizeCategory: #S,
    dataClass: #MIXED
}
define view entity ZC102_R_BP_CUSTOMER_CREATE
  as select from zc102sdt0001 as a
    inner join   zc102sdt0003 as b on  a.knkli = b.knkli
                                   and a.ctlzl = b.ctlzl
  association to parent ZC102_R_BP_BP_CREATE as _BP on $projection.Partner = _BP.Partner
{
  key a.cusno   as Cusno,
      a.partner as Partner,
      a.name1   as Name1,
      a.telf1   as Telf1,
      a.email   as Email,
      a.stras   as Stras,
      a.knkli   as Knkli,
      a.ctlzl   as Ctlzl,
      a.waers   as Waers,
      b.kbetr   as Kbetr,
      _BP
}
