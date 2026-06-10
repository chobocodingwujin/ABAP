``` abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '[BP] BP 생성'
@Metadata.ignorePropagatedAnnotations: true
//@Metadata.allowExtensions: true
define root view entity ZC102_R_BP_BP_CREATE
  as select from zc102bpt0001
  //inner join      dd07t        as b on  a.bp_group   = b.domvalue_l
  //                                and b.domname    = 'ZC102D_BP_PGROUP'
  //                              and b.ddlanguage = $session.system_language
  //left outer join zc102bpt0004 as c on a.land1 = c.land1
  association [0..1] to ZC102_BP_PGROUP_SH         as _Pgroup  on  zc102bpt0001.bp_group = _Pgroup.DomvalueL
                                                               and _Pgroup.Domname       = 'ZC102D_BP_PGROUP'
                                                               and _Pgroup.Ddlanguage    = $session.system_language
  association [0..1] to ZC102_BP_COUNTRY_SH        as _Country on  zc102bpt0001.land1 = _Country.Land1
  composition [0..*] of ZC102_R_BP_CUSTOMER_CREATE as _Customer
  composition [0..*] of ZC102_R_BP_VENDOR_CREATE   as _Vendor
  composition [0..1] of ZC102_R_BP_CREDIT_CREATE   as _Credit
  composition [0..*] of ZC102_R_BP_BANK_CREATE     as _Bank
  composition [0..*] of ZC102_R_BP_CUSTOMER_TOTAL  as _CusTotal
  composition [0..*] of ZC102_R_BP_VENDOR_MATNR    as _Matnr
  composition [0..*] of ZC102_R_BP_VENDOR_TRADE    as _Trade
  composition [0..*] of ZC102_R_BP_CUSTOMER_TRADE  as _CusMatnr
{

  key partner        as Partner,
      name1          as Name1,
      email          as Email,
      bp_role        as BpRole,
      case
        when bp_role = 'C'
            then '고객'
        when bp_role = 'V'
            then
                '거래처'
            else
                '고객/거래처'
            end      as RoleText,
      bp_type        as BpType,
      case
        when bp_type = 'P'
            then '개인'
        when bp_type = 'G'
            then
                '그룹'
            else
                '조직'
            end      as TypeText,
      bp_group       as BpGroup,
      _Pgroup.Ddtext as GroupText,
      land1          as Land1,
      _Country.Landx as Landx,
      _Country.Waers as Waers,
      _Country.Intca as Intca,
      @Semantics.systemDateTime.createdAt: true
      created_at     as CreatedAt,
      @Semantics.user.createdBy: true
      ernam          as Ernam,
      erzet          as Erzet,
      @Semantics.systemDateTime.lastChangedAt: true
      updated_at     as UpdatedAt,
      @Semantics.user.lastChangedBy: true
      aenam          as Aenam,
      aezet          as Aezet,
      image_url      as ImageUrl,

      @Semantics.mimeType: true
      mimetype       as Mimetype,

      @Semantics.largeObject: {
         mimeType: 'Mimetype',
         fileName: 'ImageUrl',
         contentDispositionPreference: #INLINE,
         acceptableMimeTypes: ['image/*']
      }
      image_data     as ImageData,
      //_association_name // Make association public
      _Customer,
      _Vendor,
      _Credit,
      _Bank,
      _CusTotal,
      _Matnr,
      _Trade,
      _CusMatnr
}
