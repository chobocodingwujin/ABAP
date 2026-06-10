``` abap
*&---------------------------------------------------------------------*
*& Include ZC102MMR0008TOP                          - Report ZC102MMR0008
*&---------------------------------------------------------------------*
REPORT zc102mmr0008 MESSAGE-ID zc102msg.

**********************************************************************
*TABLES
**********************************************************************
TABLES : zc102mmt0011 , zc102mmt0015.

**********************************************************************
*Tap Strip controls
**********************************************************************
CONTROLS gc_tab TYPE TABSTRIP.      " TAB Strip object

DATA : gv_subscreen TYPE sy-dynnr.  " Subscreen number
**********************************************************************
*CLASS INSTANCE
**********************************************************************

DATA : go_container  TYPE REF TO cl_gui_custom_container,
       go_alv_grid   TYPE REF TO cl_gui_alv_grid,

       go_tab_cont1  TYPE REF TO cl_gui_custom_container,
       go_tab_grid1  TYPE REF TO cl_gui_alv_grid,
       go_tab_cont2  TYPE REF TO cl_gui_custom_container,
       go_tab_grid2  TYPE REF TO cl_gui_alv_grid,

*--For Top of page
       go_page_cont  TYPE REF TO cl_gui_custom_container,  " TOP OF PAGE 컨테이너
       go_html_cntrl TYPE REF TO cl_gui_html_viewer,
       go_dyndoc_id  TYPE REF TO cl_dd_document.            " TOP OF PAGE

**********************************************************************
*INTERNAL TABLE AND WORKAREA
**********************************************************************
*-- 구매오더 내역(일반)
DATA: BEGIN OF gs_order,
        status TYPE icon-id.
        INCLUDE STRUCTURE zc102mmt0011.
DATA :  END OF gs_order,
gt_order LIKE TABLE OF gs_order.

*-- 구매오더 내역(재구매)
DATA: BEGIN OF gs_reorder,
        status TYPE icon-id.
        INCLUDE STRUCTURE zc102mmt0011.
DATA :  END OF gs_reorder,
gt_reorder LIKE TABLE OF gs_reorder.

*-- 송장 테이블 -> 입고상태 나타내기 위한 수량 확인용
DATA: BEGIN OF gs_iv,
        status TYPE icon-id.
        INCLUDE STRUCTURE zc102mmt0015.
DATA :  END OF gs_iv,
gt_iv LIKE TABLE OF gs_iv.

*-- 구매오더번호  F4 (SELECTION SCREEN - SEARCH HELP)
DATA : BEGIN OF gs_ebeln,
         ebeln TYPE zc102mmt0011-ebeln,
       END OF gs_ebeln,
       gt_ebeln LIKE TABLE OF gs_ebeln.

*--for ALV
DATA : gt_fcat        TYPE lvc_t_fcat, " TOP Field catalog
       gs_fcat        TYPE lvc_s_fcat,
       gs_tab1_layout TYPE lvc_s_layo,  " TAB1
       gs_tab2_layout TYPE lvc_s_layo,  " TAB2

       gt_tab_fcat1   TYPE lvc_t_fcat,   " 탭 1 FCAT
       gt_tab_fcat2   TYPE lvc_t_fcat,   " 탭 2 FCAT
       gs_tab_fcat1   TYPE lvc_s_fcat,
       gs_tab_fcat2   TYPE lvc_s_fcat,
       gs_variant     TYPE disvariant.

*-- 탭 안에 건수 표시
DATA : gv_title1(50), " 텝 타이틀 변수 선언
       gv_title2(50),

       gv_cnt1(3) VALUE '0',
       gv_cnt2(3) VALUE '0',
       gv_cnt3(3) VALUE '0'.

DATA : gv_cnt_a(3) VALUE '0',         " 기본값을 설정해줘야 0이어도 값이 나올 수 있음
       gv_cnt_b(3) VALUE '0',
       gv_cnt_c(3) VALUE '0',
       gv_cnt_d(3) VALUE '0',
       gv_cnt_e(3) VALUE '0',
       gv_cnt_f(3) VALUE '0',
       gv_cnt_total(3).

**********************************************************************
*COMMON VALUE
**********************************************************************
DATA : gv_okcode TYPE sy-ucomm,
       gv_text   TYPE sdydo_text_element,
       gv_podat  TYPE podat,
       gv_bp     TYPE partner,
       gv_ebeln  TYPE ebeln.
