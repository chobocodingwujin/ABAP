``` abap
*&---------------------------------------------------------------------*
*& Include ZC102COR0002TOP                          - Report ZC102COR0002
*&---------------------------------------------------------------------*
REPORT zc102cor0002 MESSAGE-ID zc102msg.

**********************************************************************
* Macro
**********************************************************************
DEFINE _clear.

  REFRESH &1.
  CLEAR &1.

END-OF-DEFINITION.

**********************************************************************
* TABLES
**********************************************************************
TABLES : zvc102co0001, zc102cot0006.

**********************************************************************
* TAP STRIP
**********************************************************************
CONTROLS gc_tab TYPE TABSTRIP.

DATA: gv_subscreen TYPE sy-dynnr.

**********************************************************************
* CLASS INSTANCE
**********************************************************************
DATA : go_base_cont   TYPE REF TO cl_gui_custom_container,
       go_split_cont  TYPE REF TO cl_gui_splitter_container,
       go_left_cont   TYPE REF TO cl_gui_container,
       go_left_split  TYPE REF TO cl_gui_splitter_container,
       go_tleft_cont  TYPE REF TO cl_gui_container,
       go_bleft_cont  TYPE REF TO cl_gui_container,
       go_right_cont  TYPE REF TO cl_gui_container,
       go_right_split TYPE REF TO cl_gui_splitter_container,
       go_rright_cont TYPE REF TO cl_gui_container,
       go_lright_cont TYPE REF TO cl_gui_container,
       go_tleft_grid  TYPE REF TO cl_gui_alv_grid,
       go_bleft_grid  TYPE REF TO cl_gui_alv_grid,
       go_right_grid  TYPE REF TO cl_gui_alv_grid.

*-- For Chart
DATA : go_chart    TYPE REF TO cl_gui_chart_engine.

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

**********************************************************************
* ITAB & WA
**********************************************************************
DATA : BEGIN OF gs_value.
         INCLUDE TYPE zvc102co0012.
DATA :   kostl    TYPE zc102cot0003-kostl,
         perct(6) TYPE c,
         saknr    TYPE zc102fit0002-saknr,
         txt20    TYPE zc102fit0002-txt20,
         wrbtr    TYPE zc102fit0010-wrbtr,
         waers    TYPE zc102fit0010-waers,
         cell_tab TYPE lvc_t_styl,
       END OF gs_value,
       gt_value  LIKE TABLE OF gs_value,
       gs_result LIKE gs_value,
       gt_result LIKE TABLE OF gs_value.

DATA : BEGIN OF gs_cost,
         kokrs  TYPE zc102cot0003-kokrs,
         belnr  TYPE zc102fit0009-belnr,
         kostl  TYPE zc102cot0003-kostl,
         saknr  TYPE zc102fit0002-saknr,
         txt20  TYPE zc102fit0002-txt20,
         awrbtr TYPE zc102fit0010-wrbtr,
         waers  TYPE zc102fit0010-waers,
       END OF gs_cost,
       gt_cost LIKE TABLE OF gs_cost.

DATA : BEGIN OF gs_profit.
         INCLUDE TYPE zvc102co0007.
DATA :   wrbtr TYPE zc102fit0010-wrbtr,
       END OF gs_profit,
       gt_profit LIKE TABLE OF gs_profit.

*-- For Search Help
DATA : BEGIN OF gs_txt20,
         saknr TYPE zc102fit0002-saknr,
         txt20 TYPE zc102fit0002-txt20,
       END OF gs_txt20,
       gt_txt20 LIKE TABLE OF gs_txt20.

*-- SKF 마스터
DATA : BEGIN OF gs_aunit,
         aunit TYPE zc102cot0006-aunit,
         value TYPE dd07t-domvalue_l,
       END OF gs_aunit,
       gt_aunit LIKE TABLE OF gs_aunit.

*-- For ALV
DATA : gt_value_fcat TYPE lvc_t_fcat,
       gs_value_fcat TYPE lvc_s_fcat,
       gt_cost_fcat  TYPE lvc_t_fcat,
       gs_cost_fcat  TYPE lvc_s_fcat,
       gt_res_fcat   TYPE lvc_t_fcat,
       gs_res_fcat   TYPE lvc_s_fcat,
       gs_style      TYPE lvc_s_styl,
       gs_layout     TYPE lvc_s_layo,
       gs_variant    TYPE disvariant.

DATA : gt_ui_functions TYPE ui_functions,
       gs_button       TYPE stb_button.

*-- For Chart
DATA : gv_length  TYPE i,
       gv_xstring TYPE xstring.

*-- For Search Help
DATA : BEGIN OF gs_acttp,
         acttp TYPE zc102cot0012-acttp,
         desct TYPE zc102cot0012-desct,
       END OF gs_acttp,
       gt_acttp LIKE TABLE OF gs_acttp.

**********************************************************************
* COMMON VARIABLE
**********************************************************************
*-- Screen Element
DATA : gv_gjahr     TYPE zc102fit0009-gjahr,
       gv_date_fr   TYPE zc102fit0009-budat,
       gv_date_to   TYPE zc102fit0009-budat,
       gv_kostl     TYPE zc102cot0003-kostl,
       gv_acttp(10) TYPE c,
       gv_check     TYPE bool,
       gv_lock      TYPE bool,
       gv_rb1       TYPE bool,
       gv_rb2       TYPE bool,
       gv_pct_fr    TYPE zc102cot0004-prctr,
       gv_pct_to    TYPE zc102cot0004-prctr,
       gv_cel_to    TYPE zc102fit0002-saknr,
       gv_cel_fr    TYPE zc102fit0002-saknr.

*-- Variable
DATA : gv_okcode TYPE sy-ucomm,
       gv_tabix  TYPE sy-tabix,
       gv_num    TYPE zc102cot0009-belnr,
       gv_answer.

RANGES gr_cel FOR zc102fit0002-saknr.
