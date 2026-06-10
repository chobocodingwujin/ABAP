``` abap
*&---------------------------------------------------------------------*
*& Include SAPMZC102FI0010TOP                       - Module Pool      SAPMZC102FI0010
*&---------------------------------------------------------------------*
PROGRAM sapmzc102fi0010 MESSAGE-ID zc102msg.

**********************************************************************
* TABLES
**********************************************************************
TABLES : zc102fit0015.

**********************************************************************
* CLASS INSTANCE
**********************************************************************
DATA : go_cont1       TYPE REF TO cl_gui_custom_container,
       go_cont2       TYPE REF TO cl_gui_custom_container,
       go_lsplit_cont TYPE REF TO cl_gui_splitter_container,
       go_rsplit_cont TYPE REF TO cl_gui_splitter_container,
       go_lt_cont     TYPE REF TO cl_gui_container,
       go_lb_cont     TYPE REF TO cl_gui_container,
       go_rt_cont     TYPE REF TO cl_gui_container,
       go_rb_cont     TYPE REF TO cl_gui_container,
       go_lt_grid     TYPE REF TO cl_gui_alv_grid,
       go_rt_grid     TYPE REF TO cl_gui_alv_grid.

*-- For Chart1
DATA : go_chart1 TYPE REF TO cl_gui_chart_engine.

DATA : go_ixml          TYPE REF TO if_ixml,
       go_ixml_sf       TYPE REF TO if_ixml_stream_factory,
       go_ixml_docu     TYPE REF TO if_ixml_document,
       go_ixml_ostream  TYPE REF TO if_ixml_ostream,
       go_ixml_encoding TYPE REF TO if_ixml_encoding.

DATA : go_chartdata  TYPE REF TO if_ixml_element,
       go_categories TYPE REF TO if_ixml_element,
       go_category   TYPE REF TO if_ixml_element,
       go_series     TYPE REF TO if_ixml_element,
       go_point      TYPE REF TO if_ixml_element,
       go_value      TYPE REF TO if_ixml_element.

*-- For Chart2
DATA : go_chart2 TYPE REF TO cl_gui_chart_engine.
DATA : go_ixml2          TYPE REF TO if_ixml,
       go_ixml_sf2       TYPE REF TO if_ixml_stream_factory,
       go_ixml_docu2     TYPE REF TO if_ixml_document,
       go_ixml_ostream2  TYPE REF TO if_ixml_ostream,
       go_ixml_encoding2 TYPE REF TO if_ixml_encoding.

DATA : go_chartdata2  TYPE REF TO if_ixml_element,
       go_categories2 TYPE REF TO if_ixml_element,
       go_category2   TYPE REF TO if_ixml_element,
       go_series2     TYPE REF TO if_ixml_element,
       go_point2      TYPE REF TO if_ixml_element,
       go_value2      TYPE REF TO if_ixml_element.

**********************************************************************
* ITAB & WA
**********************************************************************
*-- 당일 환율
DATA : gt_left TYPE TABLE OF zc102fit0015,
       gs_left TYPE zc102fit0015.

*-- 환율 세부 내역
DATA : BEGIN OF gs_right.
         INCLUDE STRUCTURE zc102fit0015.
DATA :   land1 TYPE t005-lkvrz,
       END OF gs_right,
       gt_right LIKE TABLE OF gs_right.

*-- 소수점 자리수
DATA: gt_tcurx TYPE TABLE OF tcurx,
      gs_tcurx TYPE tcurx.

*-- Search Help
DATA : BEGIN OF gs_waers,
         waers TYPE bkpf-waers,
       END OF gs_waers,
       gt_waers LIKE TABLE OF gs_waers.

*-- For ALV
DATA : gt_left_fcat  TYPE lvc_t_fcat,
       gs_left_fcat  TYPE lvc_s_fcat,
       gt_right_fcat TYPE lvc_t_fcat,
       gs_right_fcat TYPE lvc_s_fcat,
       gs_layout     TYPE lvc_s_layo,
       gs_variant    TYPE disvariant.

*-- For Chart
DATA : gv_length   TYPE i,
       gv_xstring  TYPE xstring,
       gv_length2  TYPE i,
       gv_xstring2 TYPE xstring.

**********************************************************************
* SCREEN ELEMENT
**********************************************************************
DATA : gv_bukrs    TYPE bukrs,
       gv_gjahr    TYPE bkpf-gjahr,
       gv_waers    TYPE waers,
       gv_df_waers TYPE waers,
       gv_minus    TYPE zc102fit0010-wrbtr,
       gv_today    TYPE wrbtr,
       gv_perct    TYPE p DECIMALS 2,
       gv_icon     TYPE icon_d,
       gv_average  TYPE wrbtr,
       gv_text(30) TYPE c.

**********************************************************************
* COMMON VARIABLE
**********************************************************************
DATA : gv_okcode TYPE sy-ucomm,
       gv_tabix  TYPE sy-tabix.

DATA: gv_amount  TYPE wrbtr,
      gv_currdec TYPE tcurx-currdec,
      gv_divider TYPE f.
