``` abap
projection;
//strict ( 2 ); //Uncomment this line in order to enable strict mode 2. The strict mode has two variants (strict(1), strict(2)) and is prerequisite to be future proof regarding syntax and to be able to release your BO.

define behavior for ZC102_P_BP_BP_CREATE //alias <alias_name>
{
  use create;
  use update;
  use delete;

  use association _Bank { create; }
  use association _Credit { create; }
  use association _Customer { create; }
  use association _Vendor { create; }
  use association _CusTotal;
  use association _Matnr{ create; }
  use association _Trade;
  use association _CusMatnr{ create; }

}

define behavior for ZC102_P_BP_BANK_CREATE //alias <alias_name>
{
  use update;
  use delete;

  use association _BP;
}

define behavior for ZC102_P_BP_CREDIT_CREATE //alias <alias_name>
{
  use update;
  use delete;

  use association _BP;
}

define behavior for ZC102_P_BP_CUSTOMER_CREATE //alias <alias_name>
{
  use update;
  use delete;

  use association _BP;
}

define behavior for ZC102_P_BP_VENDOR_CREATE //alias <alias_name>
{
  use update;
  use delete;

  use association _BP;
}

define behavior for ZC102_P_BP_CUSTOMER_TOTAL //alias <alias_name>
{

  use association _BP;
}

define behavior for ZC102_P_BP_VENDOR_MATNR //alias <alias_name>
{
  use update;
  use delete;

  use association _BP;
}

define behavior for ZC102_P_BP_CUSTOMER_TRADE//alias <alias_name>
{
  use update;
  use delete;

  use association _BP;
}

define behavior for ZC102_P_BP_VENDOR_TRADE //alias <alias_name>
{

  use association _BP;
}
