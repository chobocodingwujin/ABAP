``` abap
@AbapCatalog.viewEnhancementCategory: [#NONE]
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '[BP] 계좌 생성'
@Metadata.ignorePropagatedAnnotations: true
@Metadata.allowExtensions: true
@ObjectModel.usageType:{
    serviceQuality: #X,
    sizeCategory: #S,
    dataClass: #MIXED
}
define view entity ZC102_R_BP_BANK_CREATE
  as select from zc102fit0013 as a
  //inner join   dd07t        as b on  a.bank       = b.domvalue_l
  //                              and b.domname    = 'ZC102D_FI_BANK'
  //                              and b.ddlanguage = $session.system_language
  association to parent ZC102_R_BP_BP_CREATE as _BP on $projection.Partner = _BP.Partner
{
  key a.accno              as Accno,
      a.owner_type         as OwnerType,
      a.partner            as Partner,
      a.accnum             as Accnum,
      a.bank               as Bank,
      a.waers              as Waers,
      case when a.bank = 'YR'
            then '우리은행'
           when a.bank = 'KB'
            then '국민은행'
           when a.bank = 'SH'
            then '신한은행'
           else '기업은행' end as BankName,
      //b.ddtext     as BankName,

      _BP
}
