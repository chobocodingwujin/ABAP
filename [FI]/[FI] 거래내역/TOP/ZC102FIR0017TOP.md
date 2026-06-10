``` abap
*&---------------------------------------------------------------------*
*& Include ZC102FIR0017TOP                          - Report ZC102FIR0017
*&---------------------------------------------------------------------*
REPORT zc102fir0017 MESSAGE-ID zc102msg.

**********************************************************************
* TABLES
**********************************************************************
TABLES : zc102fit0013, zc102fit0014, zc102mmt0002, zvfit0014sum.

**********************************************************************
* Declaration area for NODE
**********************************************************************
TYPES : node_table_type LIKE STANDARD TABLE OF mtreesnode
                        WITH DEFAULT KEY.

DATA : node_table TYPE node_table_type.

**********************************************************************
* Class instance
**********************************************************************
DATA : go_container      TYPE REF TO cl_gui_docking_container,
       go_base_cont      TYPE REF TO cl_gui_easy_splitter_container,

       go_split_cont     TYPE REF TO cl_gui_splitter_container,

       go_left_cont      TYPE REF TO cl_gui_container,
       go_right_cont     TYPE REF TO cl_gui_container,
       go_right_bot_cont TYPE REF TO cl_gui_container,

       go_right_alv_grid TYPE REF TO cl_gui_alv_grid,
       go_tree           TYPE REF TO cl_gui_simple_tree.

*-- 팝업 alv
DATA : go_pop_cont     TYPE REF TO cl_gui_custom_container,
       go_pop_alv_grid TYPE REF TO cl_gui_alv_grid.

**********************************************************************
* Declaration area for Tree event
**********************************************************************
DATA: events TYPE cntl_simple_events,
      event  TYPE cntl_simple_event.

**********************************************************************
* Internal table and Work area
**********************************************************************
*-- 계좌 내역
DATA: gs_account TYPE zc102fit0014,
      gt_account TYPE TABLE OF zc102fit0014.

*-- TREE
DATA : BEGIN OF gs_tree,
         partner TYPE zc102mmt0002-partner,
         name1   TYPE zc102mmt0002-name1,
         accno   TYPE zc102fit0013-accno, " 계좌 코드로 더블클릭 반응
         accnum  TYPE zc102fit0013-accnum,
       END OF gs_tree,
       gt_tree LIKE TABLE OF gs_tree.

*-- 핫스팟 클릭
DATA : BEGIN OF gs_migyeol.
         INCLUDE STRUCTURE zc102fit0009.
DATA :   partner TYPE zc102fit0010-partner,
       END OF gs_migyeol,
       gt_migyeol LIKE TABLE OF gs_migyeol.

DATA : BEGIN OF gs_total,

         accno TYPE zvfiaccsum-accno,
         ttype TYPE zvfiaccsum-ttype,
         waers TYPE zvfiaccsum-waers,
         hsl01 TYPE zvfiaccsum-hsl01,
         hsl02 TYPE zvfiaccsum-hsl02,
         hsl03 TYPE zvfiaccsum-hsl03,
         hsl04 TYPE zvfiaccsum-hsl04,
         hsl05 TYPE zvfiaccsum-hsl05,
         hsl06 TYPE zvfiaccsum-hsl06,
         hsl07 TYPE zvfiaccsum-hsl07,
         hsl08 TYPE zvfiaccsum-hsl08,
         hsl09 TYPE zvfiaccsum-hsl09,
         hsl10 TYPE zvfiaccsum-hsl10,
         hsl11 TYPE zvfiaccsum-hsl11,
         hsl12 TYPE zvfiaccsum-hsl12,
       END OF gs_total,
       gt_total LIKE TABLE OF gs_total.

DATA : gs_fcat    TYPE lvc_s_fcat,
       gt_fcat    TYPE lvc_t_fcat,
       gs_layout  TYPE lvc_s_layo,
       gs_variant TYPE disvariant.

DATA : gs_pop_fcat    TYPE lvc_s_fcat,
       gt_pop_fcat    TYPE lvc_t_fcat,
       gs_pop_layout  TYPE lvc_s_layo,
       gs_pop_variant TYPE disvariant.

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

DATA : gs_button TYPE stb_button.

*-- For chart
DATA : gv_length  TYPE i,
       gv_xstring TYPE xstring.

**********************************************************************
* Common variable
**********************************************************************
DATA : gv_okcode  TYPE sy-ucomm.

*       gv_partner TYPE zc102fit0014-partner,
*       gv_accno   TYPE zc102fit0014-accno.
