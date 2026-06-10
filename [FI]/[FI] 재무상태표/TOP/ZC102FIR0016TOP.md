``` abap
*&---------------------------------------------------------------------*
*& Include ZC102FIR0016TOP                          - Report ZC102FIR0016
*&---------------------------------------------------------------------*
REPORT zc102fir0016 MESSAGE-ID zc102msg.

CLASS cl_gui_column_tree DEFINITION LOAD.
CLASS cl_gui_cfw DEFINITION LOAD.

**********************************************************************
* TYPE-POOLS
**********************************************************************
TYPE-POOLS ole2.

**********************************************************************
* Macro
**********************************************************************
DEFINE _popup_to_confirm.

  CALL FUNCTION 'POPUP_TO_CONFIRM'
    EXPORTING
      text_question              = &1
     text_button_1               = 'Yes'(001)
     text_button_2               = 'No'(002)
     display_cancel_button       = 'X'
   IMPORTING
     answer                      = &2
   EXCEPTIONS
     text_not_found              = 1
     OTHERS                      = 2.

END-OF-DEFINITION.

**********************************************************************
* Icon
**********************************************************************
INCLUDE <icon>.

**********************************************************************
* TABLES
**********************************************************************
TABLES : zvfaglflextc102, bkpf.

**********************************************************************
* Class instance
**********************************************************************
DATA : go_tree        TYPE REF TO cl_gui_alv_tree,
       go_container   TYPE REF TO cl_gui_docking_container,
       go_change_menu TYPE REF TO cl_ctmenu.

**********************************************************************
* Internal table and Work area
**********************************************************************
*-- 누계 CDS View
DATA : gt_jaemoo TYPE TABLE OF zvfaglflextc102,
       gs_jaemoo LIKE LINE OF gt_jaemoo.

*-- G/L 계정 정보
DATA : gt_glinfo TYPE TABLE OF zc102fit0002,
       gs_glinfo LIKE LINE OF gt_glinfo.

*-- 트리에 보여줄 ITAB
DATA : BEGIN OF gs_header,
         acdes   TYPE zc102fit0002-acdes,
         bs_lvl1 TYPE zc102fit0002-bs_lvl1,
         bs_lvl2 TYPE zc102fit0002-bs_lvl2,
         txt20   TYPE zc102fit0002-txt20,
         amount  TYPE zc102fit0010-wrbtr,
         waers   TYPE zc102fit0010-waers,
       END OF gs_header,
       gt_header LIKE TABLE OF gs_header,
       gs_tree   LIKE gs_header,
       gt_tree   LIKE TABLE OF gs_header,
       gt_outtab LIKE gt_header,
       gs_outtab LIKE gs_header.

DATA : BEGIN OF gs_total,
         acdes   TYPE zc102fit0002-bs_lvl2,
         t_wrbtr TYPE zc102fit0010-wrbtr,
         waers   TYPE zc102fit0010-waers,
       END OF gs_total,
       gt_total LIKE TABLE OF gs_total.

DATA : gs_hierhdr         TYPE treev_hhdr,
       gs_variant         TYPE disvariant,
       gt_list_commentary TYPE slis_t_listheader.

DATA : gt_fcat TYPE lvc_t_fcat,
       gs_fcat TYPE lvc_s_fcat.

**********************************************************************
* Common variable
**********************************************************************
FIELD-SYMBOLS <gv_fs> TYPE any.

DATA : gv_result TYPE zvfaglflextc102-hsl01.

DATA : gv_okcode TYPE sy-ucomm,
       gv_logo   TYPE sdydo_value.

*--------------------------------------------------------------------*
* 엑셀 다운로드 용
*--------------------------------------------------------------------*
*-- File Browser
DATA : objfile       TYPE REF TO cl_gui_frontend_services,
       pickedfolder  TYPE string,
       initialfolder TYPE string,
       fullinfo      TYPE string,
       pfolder       TYPE rlgrap-filename.  " Memory ID mfolder.

*-- For Excel
DATA : gv_tot_page   LIKE sy-pagno,         " Total page
       gv_percent(3) TYPE n,                " Reading percent
       gv_file       LIKE rlgrap-filename.  " File name

DATA : gv_temp_filename     LIKE rlgrap-filename,
       gv_temp_filename_pdf LIKE rlgrap-filename,
       gv_form(40).

DATA : excel       TYPE ole2_object,
       workbook    TYPE ole2_object,
       books       TYPE ole2_object,
       book        TYPE ole2_object,
       sheets      TYPE ole2_object,
       sheet       TYPE ole2_object,
       activesheet TYPE ole2_object,
       application TYPE ole2_object,
       pagesetup   TYPE ole2_object,
       cells       TYPE ole2_object,
       cell        TYPE ole2_object,
       row         TYPE ole2_object,
       buffer      TYPE ole2_object,
       font        TYPE ole2_object,
       range       TYPE ole2_object,  " Range
       borders     TYPE ole2_object,
       worksheet   TYPE ole2_object,
       columns     TYPE ole2_object.

DATA: cell1 TYPE ole2_object,
      cell2 TYPE ole2_object.
