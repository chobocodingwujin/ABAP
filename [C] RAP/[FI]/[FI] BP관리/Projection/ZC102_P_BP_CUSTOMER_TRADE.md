``` abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '[BP] 고객-제품 거래'
@Metadata.ignorePropagatedAnnotations: true
define view entity ZC102_P_BP_CUSTOMER_TRADE
  as projection on ZC102_R_BP_CUSTOMER_TRADE
{

      @UI.facet: [
        { id: 'Main', label: '벤더 구매 자제', type: #IDENTIFICATION_REFERENCE, position: 10 }
      ]

      @UI.selectionField: [{ position: 10 }]
  key Partner,

      @UI.identification: [{ position: 10 }]
      @UI.lineItem: [{ position: 10 }]
  key Matnr,

      @UI.identification: [{ position: 20 }]
      @UI.lineItem: [{ position: 20 }]
      Maktx,
      @UI.identification: [{ position: 30 }]
      @UI.lineItem: [{ position: 30 }]
      Mtart,

      Mtype,

      @UI.hidden: true
      @UI.identification: [{ position: 40 }]
      @UI.lineItem: [{ position: 40 }]
      @Semantics.amount.currencyCode: 'Waers'
      Stprs,


      @UI.identification: [{ position: 40 }]
      @UI.lineItem: [{ position: 40 }]
      @Semantics.amount.currencyCode: 'Waers'
      Price,

      @EndUserText.label: '거래 통화키'
      @UI.hidden: true
      @UI.identification: [{ position: 50 }]
      @UI.lineItem: [{ position: 50 }]
      @Semantics.currencyCode: true
      Waers,

      @EndUserText.label: '단위'
      @UI.identification: [{ position: 60 }]
      @UI.lineItem: [{ position: 60 }]
      Meins,
      
      Contype,
      
      /* Associations */
      _BP : redirected to parent ZC102_P_BP_BP_CREATE
}
