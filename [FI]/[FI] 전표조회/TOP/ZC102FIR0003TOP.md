``` abap
*&---------------------------------------------------------------------*
*& Include ZC102FIR0003TOP                          - Report ZC102FIR0003
*&---------------------------------------------------------------------*
REPORT zc102fir0003 MESSAGE-ID zc102msg.

**********************************************************************
* TABLES
**********************************************************************
TABLES : zc102fit0006, zc102fit0009, zc102fit0010.

**********************************************************************
* CLASS INSTANCE
**********************************************************************
*-- 전표 조회
DATA : go_base_cont   TYPE REF TO cl_gui_docking_container,
       go_split_cont  TYPE REF TO cl_gui_splitter_container,
       go_header_cont TYPE REF TO cl_gui_container,
       go_header_grid TYPE REF TO cl_gui_alv_grid,
       go_line_cont   TYPE REF TO cl_gui_container,
       go_line_grid   TYPE REF TO cl_gui_alv_grid.

*-- TOP-OF-PAGE
DATA : go_top_cont   TYPE REF TO cl_gui_docking_container,
       go_dyndoc_id  TYPE REF TO cl_dd_document,
       go_html_cntrl TYPE REF TO cl_gui_html_viewer.

**********************************************************************
* ITAB & WA
**********************************************************************
*-- 전표 헤더
DATA : gt_header TYPE TABLE OF zc102fit0009,
       gs_header TYPE zc102fit0009.

DATA : BEGIN OF gs_line.
         INCLUDE STRUCTURE zc102fit0010.
DATA :   txt20 TYPE zc102fit0002-txt20,
       END OF gs_line,
       gt_line LIKE TABLE OF gs_line.

*-- 조정 계정
DATA : gt_bpact TYPE TABLE OF zc102bpt0002,
       gs_bpact TYPE zc102bpt0002.

*-- 역분개 헤더 정보
DATA : BEGIN OF gs_reverse,
         bukrs TYPE zc102fit0009-bukrs, " 회사코드
         belnr TYPE zc102fit0009-belnr, " 회계전표번호
         rebzg TYPE zc102fit0016-rebzg, " 원전표번호
         gjahr TYPE zc102fit0009-gjahr, " 회계연도
         blart TYPE zc102fit0009-blart, " 전표유형
         bldat TYPE zc102fit0009-bldat, " 증빙일전표문서일자
         budat TYPE zc102fit0009-budat, " 전표의전기일
         bktxt TYPE zc102fit0009-bktxt, " 문서헤더텍스트
         stblg TYPE zc102fit0009-stblg, " 역분개전표번호
         stodt TYPE zc102fit0009-stodt, " 역분개전기계획일
         stgrd TYPE zc102fit0009-stgrd, " 역분개사유코드
         waers TYPE zc102fit0009-waers. " 통화키
         INCLUDE STRUCTURE zc102cms0001.
DATA : END OF gs_reverse,
gt_reverse LIKE TABLE OF gs_reverse.

DATA : gt_reverse_s TYPE TABLE OF zc102fit0009,
       gs_reverse_s TYPE zc102fit0009.

DATA : BEGIN OF gs_reverse_code,  " 우진
         stgrd TYPE zc102fit0006-stgrd,
         txt50 TYPE zc102fit0006-txt50,
       END OF gs_reverse_code,
       gt_reverse_code LIKE TABLE OF gs_reverse_code.
*
*DATA : gs_line TYPE zc102fit0010,
*       gt_line TYPE TABLE OF zc102fit0010.

DATA : gs_re_line TYPE zc102fit0010,
       gt_re_line TYPE TABLE OF zc102fit0010.

*-- BDC 우진
DATA : gt_bdcdata TYPE TABLE OF bdcdata,
       gs_bdcdata TYPE bdcdata,
       gs_params  TYPE ctu_params.
DATA : gt_messtab TYPE TABLE OF bdcmsgcoll WITH HEADER LINE.

*-- For Search Help
DATA : BEGIN OF gs_belnr,
         belnr TYPE zc102fit0009-belnr,
       END OF gs_belnr,
       gt_belnr LIKE TABLE OF gs_belnr.

*-- For ALV
DATA : gt_header_fcat TYPE lvc_t_fcat,
       gs_header_fcat TYPE lvc_s_fcat,
       gt_line_fcat   TYPE lvc_t_fcat,
       gs_line_fcat   TYPE lvc_s_fcat,
       gs_layout      TYPE lvc_s_layo,
       gs_variant     TYPE disvariant,
       gt_sort        TYPE lvc_t_sort,
       gs_sort        TYPE lvc_s_sort.

**********************************************************************
* COMMON VARIABLE
**********************************************************************
DATA : gv_okcode        TYPE sy-ucomm,
       gv_text          TYPE sdydo_text_element,
       gv_belnr         TYPE zc102fit0009-belnr,
       gv_gjahr         TYPE gjahr,
       gv_reverse_belnr TYPE string,
       gv_code          TYPE zc102fit0006-stgrd.
