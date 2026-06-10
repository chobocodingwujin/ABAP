``` abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '[BP] 여신 생성 Projection view'
@Metadata.ignorePropagatedAnnotations: true
@UI.headerInfo: {
  typeName: '여신',
  typeNamePlural: '여신들',
  title: { value: 'Partner' },
  description: { value: 'Waers' }
}
define view entity ZC102_P_BP_CREDIT_CREATE
  as projection on ZC102_R_BP_CREDIT_CREATE
{

      @UI.facet: [
        { id: 'Main', label: '여신 기본정보', type: #IDENTIFICATION_REFERENCE, position: 10 }
      ]

      @UI.hidden: true
  key Partner,

      @UI.hidden: true
      @UI.identification: [{ position: 10 }]
      @UI.lineItem: [{ position: 10 }]
      @Semantics.amount.currencyCode: 'Waers'
      CreditLimit,

      @UI.hidden: true
      @UI.identification: [{ position: 20 }]
      @UI.lineItem: [{ position: 20 }]
      @Semantics.amount.currencyCode: 'Waers'
      CreditUsed,

      @UI.hidden: true
      @UI.identification: [{ position: 30 }]
      @UI.lineItem: [{ position: 30 }]
      @Semantics.currencyCode: true
      Waers,

      @UI.hidden: true
      @UI.identification: [{ position: 40 }]
      @UI.lineItem: [{ position: 40 }]
      LastUpdated,
      /* Associations */
      _BP : redirected to parent ZC102_P_BP_BP_CREATE
}
