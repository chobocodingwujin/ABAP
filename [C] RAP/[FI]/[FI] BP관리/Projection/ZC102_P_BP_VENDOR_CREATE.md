``` abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '[BP] 벤더 생성 Projection view'
@Metadata.ignorePropagatedAnnotations: true
@UI.headerInfo: {
  typeName: '벤더',
  typeNamePlural: '벤더들',
  title: { value: 'Name1' },
  description: { value: 'Partner' }
}
define view entity ZC102_P_BP_VENDOR_CREATE
  as projection on ZC102_R_BP_VENDOR_CREATE
{

      @UI.facet: [
        { id: 'Main', label: '벤더 기본정보', type: #IDENTIFICATION_REFERENCE, position: 10 }
      ]

      @UI.hidden: true
  key Venno,
      
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
      Stras,

      @UI.hidden: true
      @UI.identification: [{ position: 50 }]
      @UI.lineItem: [{ position: 50 }]
      Knkli,
      //Erdat,
      //Ernam,
      //Erzet,
      //Aedat,
      //Aenam,
      //Aezet,
      /* Associations */
      _BP : redirected to parent ZC102_P_BP_BP_CREATE

}
