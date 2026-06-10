``` abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '[BP] 벤더-자재 생성 Projection view'
@Metadata.ignorePropagatedAnnotations: true
define view entity ZC102_P_BP_VENDOR_MATNR
  as projection on ZC102_R_BP_VENDOR_MATNR
{

      @UI.facet: [
        { id: 'Main', label: '벤더 구매 자제', type: #IDENTIFICATION_REFERENCE, position: 10 }
      ]
      @UI.selectionField: [{ position: 10 }]
      @ObjectModel.foreignKey.association: '_BP'
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

      @UI.identification: [{ position: 40 }]
      @UI.lineItem: [{ position: 40 }]
      @Semantics.amount.currencyCode: 'Waers'
      Stprs,

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
