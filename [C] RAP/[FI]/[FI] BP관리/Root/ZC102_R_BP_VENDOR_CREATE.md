``` abap
@AbapCatalog.viewEnhancementCategory: [#NONE]
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '[BP] 벤더 생성'
@Metadata.ignorePropagatedAnnotations: true
@ObjectModel.usageType:{
    serviceQuality: #X,
    sizeCategory: #S,
    dataClass: #MIXED
}
define view entity ZC102_R_BP_VENDOR_CREATE
  as select from zc102mmt0002
  association to parent ZC102_R_BP_BP_CREATE as _BP on $projection.Partner = _BP.Partner

{
    key zc102mmt0002.venno as Venno,
    zc102mmt0002.partner as Partner,
    zc102mmt0002.name1 as Name1,
    zc102mmt0002.telf1 as Telf1,
    zc102mmt0002.stras as Stras,
    zc102mmt0002.knkli as Knkli,
    zc102mmt0002.erdat as Erdat,
    zc102mmt0002.ernam as Ernam,
    zc102mmt0002.erzet as Erzet,
    zc102mmt0002.aedat as Aedat,
    zc102mmt0002.aenam as Aenam,
    zc102mmt0002.aezet as Aezet,
    _BP
  }
