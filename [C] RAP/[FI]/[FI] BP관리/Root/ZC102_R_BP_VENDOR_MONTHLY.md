``` abap
@AbapCatalog.viewEnhancementCategory: [#NONE]
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '[BP] 벤더-자재 구매 월별'
@Metadata.ignorePropagatedAnnotations: true
@ObjectModel.usageType:{
    serviceQuality: #X,
    sizeCategory: #S,
    dataClass: #MIXED
}
define view entity ZC102_R_BP_VENDOR_MONTHLY
  as select from zc102mmt0011
{
  key partner                                          as Partner,
  key ebeln                                            as Ebeln,
  key prno                                             as Prno,
  key stlno                                            as Stlno,
      matnr                                            as Matnr,
      @Semantics.quantity.unitOfMeasure: 'Meins'
      menge                                            as Menge,
      meins                                            as Meins,
      @Semantics.amount.currencyCode: 'Waers'
      stprs                                            as Stprs,
      waers                                            as Waers,
      cast( substring( podat, 1, 4 ) as abap.numc(4) ) as TYear,
      cast( substring( podat, 5, 2 ) as abap.numc(2) ) as Monat,
      erdat                                            as Erdat,
      ernam                                            as Ernam,
      erzet                                            as Erzet,
      aedat                                            as Aedat,
      aenam                                            as Aenam,
      aezet                                            as Aezet
}
