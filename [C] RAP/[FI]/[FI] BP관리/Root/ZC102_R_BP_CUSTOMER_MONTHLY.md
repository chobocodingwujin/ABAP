``` abap
@AbapCatalog.viewEnhancementCategory: [#NONE]
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '[BP] 고객 월별 거래'
@Metadata.ignorePropagatedAnnotations: true
@ObjectModel.usageType:{
    serviceQuality: #X,
    sizeCategory: #S,
    dataClass: #MIXED
}
define view entity ZC102_R_BP_CUSTOMER_MONTHLY
  as select from zc102fit0010 as a
    inner join   zc102fit0009 as b on  a.bukrs = b.bukrs
                                   and a.belnr = b.belnr
                                   and a.gjahr = b.gjahr
{
  key a.bukrs                                            as Bukrs,
      //key a.belnr                                            as Belnr,
  key a.gjahr                                            as Gjahr,
  key a.partner                                          as Partner,
      cast( substring( b.budat, 5, 2 ) as abap.numc(2) ) as Monat,
      @Semantics.amount.currencyCode: 'Waers'
      case when a.waers = 'KRW'
            then a.wrbtr
            else a.dmbtr end                             as Wrbtr,
      cast( 'KRW' as s_currcode )                        as Waers
      //a.wrbtr                                            as Wrbtr,
      //a.waers                                            as Waers
}
where
      b.stblg = ''
  and a.koart = 'D'
