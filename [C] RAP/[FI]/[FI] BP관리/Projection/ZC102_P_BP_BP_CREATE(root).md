``` abap
@AccessControl.authorizationCheck: #NOT_REQUIRED
@EndUserText.label: '[BP] BP 생성 Projection view'
@Metadata.ignorePropagatedAnnotations: true
@UI.headerInfo: {
  typeName: 'BP',
  typeNamePlural: 'BPs',
  title: { value: 'Name1' },
  description: { value: 'Partner' }
}
define root view entity ZC102_P_BP_BP_CREATE
  provider contract transactional_query
  as projection on ZC102_R_BP_BP_CREATE
{

      @UI.facet: [
        { id: 'GeneralInfo', label: 'BP 기본정보', type: #IDENTIFICATION_REFERENCE, position: 10},
        { id: 'Customer', label: '고객 정보', type: #IDENTIFICATION_REFERENCE, targetElement: '_Customer', position: 20 },
        { id: 'Vendor', label: '벤더 정보', type: #IDENTIFICATION_REFERENCE, targetElement: '_Vendor', position: 30 },
        { id: 'Credit', label: '여신 정보', type: #IDENTIFICATION_REFERENCE, targetElement: '_Credit', position: 40 },
        { id: 'Bank', label: '계좌 정보', type: #LINEITEM_REFERENCE, targetElement: '_Bank', position: 50 }
      ]

      @Consumption.valueHelpDefinition: [{ entity: {
          name: 'ZC102_BP_PARTNER_SH',
          element: 'Partner'
      }}]
      @UI.selectionField: [{ position: 10 }]
      @UI.identification: [{ position: 10 }]
      @UI.lineItem: [{ position: 10 }]
  key Partner,

      @UI.selectionField: [{ position: 20 }]
      @UI.identification: [{ position: 20 }]
      @UI.lineItem: [{ position: 20 }]
      Name1,

      Email,

      //@UI.identification: [{ position: 30 }]
      //Venno,

      //@UI.identification: [{ position: 40 }]
      //Cusno,

      //@UI.identification: [{ position: 50 }]
      //Accno,

      //@UI.hidden: true
      //@UI.selectionField: [{ position: 30 }]
      //@UI.identification: [{ position: 30 }]
      //@UI.lineItem: [{ position: 30 }]
      BpType,

      @EndUserText.label: '파트너 타입'
      @UI.identification: [{ position: 30 }]
      @UI.lineItem: [{ position: 30 }]
      TypeText,

      //@UI.hidden: true
      //@UI.identification: [{ position: 50 }]
      //@UI.lineItem: [{ position: 50 }]
      BpRole,

      @EndUserText.label: '파트너 역할'
      @UI.identification: [{ position: 40 }]
      @UI.lineItem: [{ position: 40 }]
      RoleText,

      //@UI.hidden: true
      //@UI.identification: [{ position: 70 }]
      //@UI.lineItem: [{ position: 70 }]
      //@Consumption.valueHelpDefinition: [{ entity: {
      //name: 'ZC102_BP_PGROUP_SH',
      //element: 'DomvalueL'
      //}}]
      BpGroup,

      @EndUserText.label: '파트너 그룹'
      @UI.identification: [{ position: 50 }]
      @UI.lineItem: [{ position: 50 }]
      GroupText,

      @UI.hidden: true
      @UI.identification: [{ position: 60 }]
      @UI.lineItem: [{ position: 60 }]
      Land1,

      @UI.hidden: true
      @UI.identification: [{ position: 70 }]
      @UI.lineItem: [{ position: 70 }]
      Landx,

      @UI.hidden: true
      @UI.identification: [{ position: 80 }]
      @UI.lineItem: [{ position: 80 }]
      Waers,

      @UI.hidden: true
      @UI.identification: [{ position: 90 }]
      @UI.lineItem: [{ position: 90 }]
      Intca,

      @UI.hidden: true
      @UI.identification: [{ position: 100 }]
      ImageUrl,

      @UI.hidden: true
      @UI.identification: [{ position: 110 }]
      Mimetype,

      @UI.hidden: true
      @EndUserText.label: 'Image'
      @UI.identification: [{ position: 120 }]
      @UI.lineItem: [{ position: 120 }]
      ImageData,

      //@UI.hidden: true
      //@UI.identification: [{ position: 140 }]
      //@UI.lineItem: [{ position: 140 }]
      UpdatedAt,

      @UI.hidden: true
      @UI.identification: [{ position: 130 }]
      @UI.lineItem: [{ position: 130 }]
      Aenam,


      //@UI.hidden: true
      //@UI.identification: [{ position: 150 }]
      //@UI.lineItem: [{ position: 150 }]
      CreatedAt,

      @UI.hidden: true
      @UI.identification: [{ position: 140 }]
      @UI.lineItem: [{ position: 140 }]
      Ernam,

      /* Associations */
      _Bank     : redirected to composition child ZC102_P_BP_BANK_CREATE,
      _Credit   : redirected to composition child ZC102_P_BP_CREDIT_CREATE,
      _Customer : redirected to composition child ZC102_P_BP_CUSTOMER_CREATE,
      _Vendor   : redirected to composition child ZC102_P_BP_VENDOR_CREATE,
      _CusTotal : redirected to composition child ZC102_P_BP_CUSTOMER_TOTAL,
      _Matnr    : redirected to composition child ZC102_P_BP_VENDOR_MATNR,
      _Trade    : redirected to composition child ZC102_P_BP_VENDOR_TRADE,
      _CusMatnr : redirected to composition child ZC102_P_BP_CUSTOMER_TRADE
}
