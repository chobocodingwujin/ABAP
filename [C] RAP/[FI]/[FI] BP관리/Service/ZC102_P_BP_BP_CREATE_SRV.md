``` abap
@EndUserText.label: '[BP] BP 생성 Service definition'
define service ZC102_P_BP_BP_CREATE_SRV {
  expose ZC102_P_BP_BP_CREATE       as BpSet;
  expose ZC102_P_BP_BANK_CREATE     as BankSet;
  expose ZC102_P_BP_CUSTOMER_CREATE as CusSet;
  expose ZC102_P_BP_VENDOR_CREATE   as VenSet;
  expose ZC102_P_BP_CREDIT_CREATE   as CreditSet;
  expose ZC102_P_BP_CUSTOMER_TOTAL  as CusTotalSet;
  expose ZC102_P_BP_VENDOR_MATNR    as VenMatSet;
  expose ZC102_P_BP_VENDOR_TRADE    as VenTrade;
  expose ZC102_BP_PGROUP_SH         as PgroupSet;
  expose ZC102_BP_COUNTRY_SH        as CountrySet;
  expose ZC102_BP_MATNR_SH          as MatnrSet;
  expose ZC102_P_BP_CUSTOMER_TRADE  as CusTradeSet;
}
