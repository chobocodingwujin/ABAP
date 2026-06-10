``` abap
@AbapCatalog.viewEnhancementCategory: [#NONE]
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '[BP] 벤더-자재 생성'
@Metadata.ignorePropagatedAnnotations: true
@ObjectModel.usageType:{
    serviceQuality: #X,
    sizeCategory: #S,
    dataClass: #MIXED
}
define view entity ZC102_R_BP_VENDOR_MATNR
  as select distinct from zc102mmt0019 as a
    inner join            zc102mmt0004 as b on a.matnr = b.matnr
  association to parent ZC102_R_BP_BP_CREATE as _BP on $projection.Partner = _BP.Partner
{
  key a.partner as Partner,
  key a.matnr   as Matnr,
      b.maktx   as Maktx,
      b.mtart   as Mtart,
      b.mtype   as Mtype,
      @Semantics.amount.currencyCode: 'Waers'
      b.stprs   as Stprs,
      b.waers   as Waers,
      b.meins   as Meins,
      a.contype as Contype,
      _BP
}
where
  a.contype = 'V'
