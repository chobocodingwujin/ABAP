``` abap
*&---------------------------------------------------------------------*
*& Include ZC102FIR0015TOP                          - Report ZC102FIR0015
*&---------------------------------------------------------------------*
REPORT zc102fir0015 MESSAGE-ID zc102msg.

**********************************************************************
* TABLES
**********************************************************************
TABLES : zvfaglflextc102, zc102fit0002, bkpf, zc102fit0009.

**********************************************************************
* Class instance
**********************************************************************
DATA : go_base_container   TYPE REF TO cl_gui_custom_container,
       " split left alv right chart

       go_split_cont       TYPE REF TO cl_gui_splitter_container,

       go_lbottom_cont     TYPE REF TO cl_gui_container,
       go_rbottom_cont     TYPE REF TO cl_gui_container,

       go_lbottom_alv_grid TYPE REF TO cl_gui_alv_grid,

*-- popup alv
       go_pop_container    TYPE REF TO cl_gui_custom_container,
       go_pop_alv_grid     TYPE REF TO cl_gui_alv_grid,

*-- For Top-of-page
       go_top_container    TYPE REF TO cl_gui_docking_container,
       go_dyndoc_id        TYPE REF TO cl_dd_document,
       go_html_cntrl       TYPE REF TO cl_gui_html_viewer.

*-- Chart
DATA : go_chart TYPE REF TO cl_gui_chart_engine.

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
* Internal table and Work area
**********************************************************************
*-- CDS View 누계
DATA : BEGIN OF gs_total.
         INCLUDE STRUCTURE zvfaglflextc102.
DATA : END OF gs_total,
gt_total LIKE TABLE OF gs_total.

*-- G/L 계정과목 텍스트
DATA : BEGIN OF gs_txt20,
         saknr TYPE zc102fit0002-saknr,
         txt20 TYPE zc102fit0002-txt20,
       END OF gs_txt20,
       gt_txt20 LIKE TABLE OF gs_txt20.

*-- ALV에 보여줄 ITAB / WA
DATA : BEGIN OF gs_csanpyo,
         saknr     TYPE zc102fit0002-saknr,       " 계정코드
         txt20     TYPE zc102fit0002-txt20,       " 계정명
         total_s   TYPE zc102_fi_faglflext-hsl01, " 차변합계
         total_h   TYPE zc102_fi_faglflext-hsl01, " 대변합계
         balan     TYPE zc102_fi_faglflext-hsl01, " 잔액
         baldir(2),
         waers     TYPE zc102fit0010-waers,       " 통화키
       END OF gs_csanpyo,
       gt_csanpyo LIKE TABLE OF gs_csanpyo.

*-- 계정과목별 차대 합계
DATA : BEGIN OF gs_all_total,
         all_total_s TYPE zc102_fi_faglflext-hsl01,
         all_total_h TYPE zc102_fi_faglflext-hsl01,
         balan_total TYPE zc102_fi_faglflext-hsl01,
       END OF gs_all_total,
        gt_all_total LIKE TABLE OF gs_all_total.

DATA : BEGIN OF gs_jeonpyo,
         bukrs    TYPE zc102fit0009-bukrs,
         gjahr    TYPE zc102fit0009-gjahr,
         belnr    TYPE zc102fit0009-belnr,
         blart    TYPE zc102fit0009-blart,
         bldat    TYPE zc102fit0009-bldat,
         budat    TYPE zc102fit0009-budat,
         bktxt    TYPE zc102fit0009-bktxt,
         waers    TYPE zc102fit0009-waers,
         saknr    TYPE zc102fit0010-saknr,
         s_amount TYPE zc102fit0010-wrbtr,
         h_amount TYPE zc102fit0010-wrbtr,
       END OF gs_jeonpyo,
       gt_jeonpyo LIKE TABLE OF gs_jeonpyo.

DATA : BEGIN OF gs_sh_wrbtr, " 해당 전표의 차대 금액 구해오기
         gjahr TYPE zc102fit0010-gjahr,
         belnr TYPE zc102fit0010-belnr,
         shkzg TYPE zc102fit0010-shkzg,
         wrbtr TYPE zc102fit0010-wrbtr,
       END OF gs_sh_wrbtr,
       gt_sh_wrbtr LIKE TABLE OF gs_sh_wrbtr.

*-- left alv
DATA : gt_left_fcat    TYPE lvc_t_fcat,
       gs_left_fcat    TYPE lvc_s_fcat,
       gt_left_sort    TYPE lvc_t_sort,
       gs_left_sort    TYPE lvc_s_sort,
       gs_left_layout  TYPE lvc_s_layo,
       gs_left_variant TYPE disvariant.

*-- popup alv
DATA : gt_pop_fcat    TYPE lvc_t_fcat,
       gs_pop_fcat    TYPE lvc_s_fcat,
       gt_pop_sort    TYPE lvc_t_sort,
       gs_pop_sort    TYPE lvc_s_sort,
       gs_pop_layout  TYPE lvc_s_layo,
       gs_pop_variant TYPE disvariant.

DATA : gs_button       TYPE stb_button.

*-- For chart
DATA : gv_length  TYPE i,
       gv_xstring TYPE xstring.
**********************************************************************
* Comman variable
**********************************************************************
FIELD-SYMBOLS <gv_fs> TYPE any.

DATA : gv_result TYPE zvfaglflextc102-hsl01.

DATA : gv_month(2)   TYPE n,
       gv_var(30),
       gv_amount(20),
       gv_count(50),
       gv_monat,
       gv_saknr(6)   TYPE n.

DATA : gv_okcode TYPE sy-ucomm.
