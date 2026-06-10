``` abap
*&---------------------------------------------------------------------*
*& Include ZC102FIR0001TOP                          - Report ZC102FIR0001
*&---------------------------------------------------------------------*
REPORT zc102fir0001 MESSAGE-ID zc102msg.

**********************************************************************
* TABLES
**********************************************************************
TABLES : zc102fit0009, zc102fit0010.

**********************************************************************
* CLASS INSTANCE
**********************************************************************
DATA : go_container TYPE REF TO cl_gui_custom_container,
       go_alv_grid  TYPE REF TO cl_gui_alv_grid.

**********************************************************************
* ITAB & WA
**********************************************************************
*-- 전표 헤더
DATA : BEGIN OF gs_header.
         INCLUDE STRUCTURE zc102fit0009.
DATA :   cell_tab TYPE lvc_t_styl,
         modi_yn,
       END OF gs_header,
       gt_header LIKE TABLE OF gs_header.

*-- 전표 라인
DATA : BEGIN OF gs_line.
         INCLUDE STRUCTURE zc102fit0010.
DATA :   txt20    TYPE zc102fit0002-txt20,
         dwaer    TYPE waers,
         cell_tab TYPE lvc_t_styl,
         modi_yn,
       END OF gs_line,
       gt_line LIKE TABLE OF gs_line.

*-- 환율 계산
DATA : gt_rate TYPE TABLE OF zc102fit0015,
       gs_rate TYPE zc102fit0015.

DATA: gt_tcurx TYPE TABLE OF tcurx,
      gs_tcurx TYPE tcurx.

*-- For ALV
DATA : gt_line_fcat TYPE lvc_t_fcat,
       gs_line_fcat TYPE lvc_s_fcat,
       gs_layout    TYPE lvc_s_layo,
       gs_variant   TYPE disvariant,
       gs_style     TYPE lvc_s_styl,
       gs_scol      TYPE lvc_s_scol,
       gs_satble    TYPE lvc_s_stbl,
       gt_sort      TYPE lvc_t_sort,
       gs_sort      TYPE lvc_s_sort.

DATA : gt_ui_functions TYPE ui_functions,
       gs_button       TYPE stb_button.

*-- For ALV List box
DATA : gt_bschl_drop TYPE lvc_t_drop,
       gs_bschl_drop TYPE lvc_s_drop.

*-- For Search Help
DATA : BEGIN OF gs_bschl,
         bschl TYPE zc102fit0004-bschl,
         koart TYPE zc102fit0004-koart,
         ltext TYPE zc102fit0004-ltext,
       END OF gs_bschl,
       gt_bschl LIKE TABLE OF gs_bschl.

DATA : BEGIN OF gs_blart,
         blart TYPE zc102fit0005-blart,
         ltext TYPE zc102fit0005-ltext,
       END OF gs_blart,
       gt_blart LIKE TABLE OF gs_blart.

DATA : BEGIN OF gs_saknr,
         saknr TYPE zc102fit0002-saknr,
         txt20 TYPE zc102fit0002-txt20,
       END OF gs_saknr,
       gt_saknr LIKE TABLE OF gs_saknr.

DATA : BEGIN OF gs_waers,
         o_waers TYPE zc102fit0015-o_waers,
       END OF gs_waers,
       gt_waers LIKE TABLE OF gs_waers.

*-- 조정 계정
DATA : gt_partner TYPE TABLE OF zc102BPT0002,
       gs_partner TYPE zc102BPT0002.

**********************************************************************
* SCREEN ELEMENT
**********************************************************************
DATA : gv_debit_sum  TYPE wrbtr,
       gv_credit_sum TYPE wrbtr,
       gv_total      TYPE wrbtr,
       gv_icon       TYPE icon_d,
       gv_info1      TYPE icon_d,
       gv_info2      TYPE icon_d,
       gv_info3      TYPE icon_d,
       gv_info4      TYPE icon_d,
       gv_info5      TYPE icon_d,
       gv_ltext      TYPE ltext,
       gv_waers      TYPE waers.

**********************************************************************
* COMMON VARIABLE
**********************************************************************
DATA : gv_okcode  TYPE sy-ucomm,
       gv_tabix   TYPE sy-tabix,
       gv_num(10) TYPE c,
       gv_answer.

DATA: gv_amount  TYPE wrbtr,
      gv_currdec TYPE tcurx-currdec,
      gv_divider TYPE f.

DATA : gv_lock       TYPE bool,
       gv_bschl_lock TYPE bool,
       gv_blart_lock TYPE bool,
       gv_saknr_lock TYPE bool,
       gv_waers_lock TYPE bool.
