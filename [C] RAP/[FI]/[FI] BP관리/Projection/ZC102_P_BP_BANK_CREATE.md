``` abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '[BP] 계좌 생성 Projection view'
@Metadata.ignorePropagatedAnnotations: true
@UI.headerInfo: {
  typeName: '계좌',
  typeNamePlural: '계좌들',
  title: { value: 'Accnum' },          // 주요 표시 필드
  description: { value: 'Partner' }    // 서브 설명 필드
}
define view entity ZC102_P_BP_BANK_CREATE
  as projection on ZC102_R_BP_BANK_CREATE
{
      @UI.facet: [
        { id: 'Main', label: '계좌 기본정보', type: #IDENTIFICATION_REFERENCE, position: 10 }
      ]

      @UI.hidden: true
  key Accno,

      //@UI.hidden: true
      @UI.identification: [{ position: 10 }]
      @UI.lineItem: [{ position: 10 }]
      OwnerType,

      //@UI.hidden: true
      @UI.selectionField: [{ position: 20 }]
      //@UI.identification: [{ position: 20 }]
      //@UI.lineItem: [{ position: 20 }]
      Partner,

      //@UI.hidden: true
      @UI.identification: [{ position: 30 }]
      @UI.lineItem: [{ position: 30 }]
      Accnum,

      //@UI.hidden: true
      @EndUserText.label: '은행 코드'
      @UI.identification: [{ position: 40 }]
      @UI.lineItem: [{ position: 40 }]
      Bank,

      @EndUserText.label: '은행 이름'
      @UI.identification: [{ position: 50 }]
      @UI.lineItem: [{ position: 50 }]
      BankName,

      //@UI.hidden: true
      @UI.identification: [{ position: 60 }]
      @UI.lineItem: [{ position: 60 }]
      Waers,

      /* Associations */
      _BP : redirected to parent ZC102_P_BP_BP_CREATE
}
