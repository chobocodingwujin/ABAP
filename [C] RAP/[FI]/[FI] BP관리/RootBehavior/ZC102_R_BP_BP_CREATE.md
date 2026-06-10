``` abap
managed implementation in class zbp_c102_r_bp_bp_create unique;
// strict ( 2 );

define behavior for ZC102_R_BP_BP_CREATE //alias <alias_name>
persistent table zc102bpt0001
lock master
late numbering
//with unmanaged save
// authorization master ( instance )
//etag master <field_name>
{
  create;
  update;
  delete;

  field ( readonly : update ) Partner, CreatedAt, UpdatedAt, Ernam, Aenam;
  //field ( mandatory : create ) Partner;

  association _Bank { create; }
  association _Credit { create; }
  association _Customer { create; }
  association _Vendor { create; }
  association _CusTotal;
  association _Matnr { create; }
  association _Trade;

  mapping for zc102bpt0001 corresponding
    {
      BpGroup   = bp_group;
      BpRole    = bp_role;
      BpType    = bp_type;
      ImageUrl  = image_url;
      ImageData = image_data;
      CreatedAt = created_at;
      UpdatedAt = updated_at;
    }

}

define behavior for ZC102_R_BP_BANK_CREATE //alias <alias_name>
persistent table zc102fit0013
lock dependent by _BP
late numbering
//authorization dependent by _BP
//etag master <field_name>
{
  update;
  delete;

  field ( readonly : update ) Partner, Accno;
  //field ( mandatory : create ) Accno;
  association _BP;

  mapping for zc102fit0013 corresponding
    {

      // 서로 다른 대상에 대해서만 필요함!
      OwnerType = owner_type;
    }

}

define behavior for ZC102_R_BP_CREDIT_CREATE //alias <alias_name>
persistent table zc102fit0008
lock dependent by _BP
late numbering
//authorization dependent by _BP
//etag master <field_name>
{
  update;
  delete;
  field ( readonly ) Partner;
  association _BP;

  mapping for zc102fit0008 corresponding
    {

      // 서로 다른 대상에 대해서만 필요함!
      CreditLimit = credit_limit;
      CreditUsed  = credit_used;
      LastUpdated = last_updated;
    }
}

define behavior for ZC102_R_BP_CUSTOMER_CREATE //alias <alias_name>
persistent table zc102sdt0001
lock dependent by _BP
late numbering
//authorization dependent by _BP
//etag master <field_name>
{
  update;
  delete;
  field ( readonly : update ) Partner, Cusno;
  // field ( mandatory : create ) Cusno;

  association _BP;

  mapping for zc102sdt0001 corresponding
    {
    }
}

define behavior for ZC102_R_BP_VENDOR_CREATE //alias <alias_name>
persistent table zc102mmt0002
lock dependent by _BP
late numbering
//authorization dependent by _BP
//etag master <field_name>
{
  update;
  delete;
  field ( readonly : update ) Partner, Venno;
  //field ( mandatory : create ) Venno;
  association _BP;
}


define behavior for ZC102_R_BP_CUSTOMER_TOTAL
persistent table zc102sdt0001
lock dependent by _BP
late numbering
{
  field ( readonly ) Partner, Gjahr, Bukrs, Monat, Wrbtr, Waers;
  association _BP;  // <-- 반드시 명시 필요
  mapping for zc102sdt0001 corresponding
    {
    }
}

define behavior for ZC102_R_BP_VENDOR_MATNR //alias <alias_name>
persistent table zc102mmt0019
lock dependent by _BP
late numbering
//authorization dependent by _BP
//etag master <field_name>
{
  update;
  delete;
  //field ( mandatory : create ) Matnr, Partner;
  field ( readonly : update ) Matnr, Partner;
  //field ( mandatory : create ) Venno;
  association _BP;

  mapping for zc102mmt0019 corresponding
    {
      Matnr   = matnr;
      Partner = partner;
      Stprs   = stprs;
      Waers   = waers;
    }
}

define behavior for ZC102_R_BP_CUSTOMER_TRADE //alias <alias_name>
persistent table zc102mmt0019
lock dependent by _BP
late numbering
//authorization dependent by _BP
//etag master <field_name>
{
  update;
  delete;
  field ( mandatory : create ) Matnr;
  field ( readonly : update ) Partner;
  //field ( mandatory : create ) Venno;
  association _BP;

  mapping for zc102mmt0019 corresponding
    {
      Matnr   = matnr;
      Partner = partner;
      Stprs   = stprs;
      Waers   = waers;
    }
}

define behavior for ZC102_R_BP_VENDOR_TRADE
persistent table zc102mmt0015
lock dependent by _BP
late numbering
{
  field ( readonly ) Partner;
  association _BP;  // <-- 반드시 명시 필요
  mapping for zc102mmt0015 corresponding
    {
    }
}
