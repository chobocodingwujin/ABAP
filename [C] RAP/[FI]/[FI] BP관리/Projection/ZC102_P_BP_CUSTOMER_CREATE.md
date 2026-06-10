``` abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '[BP] 고객 생성 Projection view'
@Metadata.ignorePropagatedAnnotations: true
@UI.headerInfo: {
  typeName: '고객',
  typeNamePlural: '고객들',
  title: { value: 'Name1' },
  description: { value: 'Partner' }
}
define view entity ZC102_P_BP_CUSTOMER_CREATE
  as projection on ZC102_R_BP_CUSTOMER_CREATE
{

      @UI.facet: [
        { id: 'Main', label: '고객 기본정보', type: #IDENTIFICATION_REFERENCE, position: 10 }
      ]

      @UI.hidden: true
  key Cusno,

      @UI.hidden: true
      @UI.identification: [{ position: 10 }]
      @UI.lineItem: [{ position: 10 }]
      Partner,

      @UI.hidden: true
      @UI.identification: [{ position: 20 }]
      @UI.lineItem: [{ position: 20 }]
      Name1,

      @UI.hidden: true
      @UI.identification: [{ position: 30 }]
      @UI.lineItem: [{ position: 30 }]
      Telf1,

      @UI.hidden: true
      @UI.identification: [{ position: 40 }]
      @UI.lineItem: [{ position: 40 }]
      Email,

      @UI.hidden: true
      @UI.identification: [{ position: 50 }]
      @UI.lineItem: [{ position: 50 }]
      Stras,

      @UI.hidden: true
      @UI.identification: [{ position: 60 }]
      @UI.lineItem: [{ position: 60 }]
      Knkli,

      @UI.hidden: true
      @UI.identification: [{ position: 70 }]
      @UI.lineItem: [{ position: 70 }]
      Ctlzl,

      @UI.hidden: true
      @UI.identification: [{ position: 80 }]
      @UI.lineItem: [{ position: 80 }]
      Kbetr,

      @UI.hidden: true
      @UI.identification: [{ position: 80 }]
      @UI.lineItem: [{ position: 80 }]
      Waers,
      /* Associations */
      _BP     : redirected to parent ZC102_P_BP_BP_CREATE
}
