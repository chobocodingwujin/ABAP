``` abap
*&---------------------------------------------------------------------*
*& Include ZC102FIR0004TOP                          - Report ZC102FIR0004
*&---------------------------------------------------------------------*
REPORT zc102fir0004 MESSAGE-ID zc102msg.

**********************************************************************
* TABLES
**********************************************************************
TABLES : zc102fit0007, zc102fit0012, zc102fit0009.

**********************************************************************
* Declaration area for NODE
**********************************************************************
TYPES: node_table_type LIKE STANDARD TABLE OF mtreesnode
                       WITH DEFAULT KEY.
DATA: node_table TYPE node_table_type.

DATA: events TYPE cntl_simple_events,
      event  TYPE cntl_simple_event.
**********************************************************************
* CLASS INSTANCE
**********************************************************************
DATA : go_container       TYPE REF TO cl_gui_docking_container,
       go_base_split_cont TYPE REF TO cl_gui_splitter_container,
       go_left_cont       TYPE REF TO cl_gui_container,
       go_right_cont      TYPE REF TO cl_gui_container,
       go_split_cont      TYPE REF TO cl_gui_splitter_container,
       go_tcont           TYPE REF TO cl_gui_container,
       go_bcont           TYPE REF TO cl_gui_container,
       go_alv_grid        TYPE REF TO cl_gui_alv_grid,
       go_tree            TYPE REF TO cl_gui_simple_tree.

DATA : go_line_cont TYPE REF TO cl_gui_custom_container,
       go_line_grid TYPE REF TO cl_gui_alv_grid.

*-- Top-of-page
DATA : go_top_cont   TYPE REF TO cl_gui_docking_container,
       go_dyndoc_id  TYPE REF TO cl_dd_document,
       go_html_cntrl TYPE REF TO cl_gui_html_viewer.

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

*-- For Popup
DATA : go_pop_cont TYPE REF TO cl_gui_custom_container,
       go_pop_grid TYPE REF TO cl_gui_alv_grid.

**********************************************************************
* ITAB & WA
**********************************************************************
*-- Master
DATA : BEGIN OF gs_master.
         INCLUDE STRUCTURE zc102fit0007.
DATA :   attach TYPE icon_d,
       END OF gs_master,
       gt_master LIKE TABLE OF gs_master.

*-- Log
DATA : gt_body TYPE TABLE OF zc102fit0012,
       gs_body TYPE zc102fit0012.

*-- Docu Line
DATA : BEGIN OF gs_line.
         INCLUDE STRUCTURE zc102fit0010.
DATA :   txt20 TYPE zc102fit0002-txt20,
       END OF gs_line,
       gt_line LIKE TABLE OF gs_line.

*-- Text Data
DATA : gt_txt20 TYPE TABLE OF zc102fit0002,
       gs_txt20 TYPE zc102fit0002.

*-- For Master PDF
DATA : BEGIN OF gs_master_pdf.
         INCLUDE STRUCTURE zc102fit0007.
DATA :   attach TYPE icon_d,
       END OF gs_master_pdf,
       gt_master_pdf LIKE TABLE OF gs_master_pdf.

*-- For ALV
DATA : gt_fcat        TYPE lvc_t_fcat,
       gs_fcat        TYPE lvc_s_fcat,
       gt_line_fcat   TYPE lvc_t_fcat,
       gs_line_fcat   TYPE lvc_s_fcat,
       gs_layout      TYPE lvc_s_layo,
       gs_docu_layout TYPE lvc_s_layo,
       gs_variant     TYPE disvariant,
       gt_sort        TYPE lvc_t_sort,
       gs_sort        TYPE lvc_s_sort,
       gt_docu_sort   TYPE lvc_t_sort,
       gt_docu_sort1  TYPE lvc_t_sort,
       gs_docu_sort   TYPE lvc_s_sort.

*-- For Chart
DATA : gv_length  TYPE i,
       gv_xstring TYPE xstring.

*-- For Popup ALV
DATA : gt_pop_fcat TYPE lvc_t_fcat,
       gs_pop_fcat TYPE lvc_s_fcat,
       gs_stable   TYPE lvc_s_stbl.

**********************************************************************
* COMMON VARIABLE
**********************************************************************
*-- Screen Element
DATA : gv_anln1_2     TYPE zc102fit0012-anln1,
       gv_erdat       TYPE zc102fit0006-erdat,
       gv_desum       TYPE zc102fit0012-desum,
       gv_buypr       TYPE zc102fit0012-buypr,
       gv_bvalu       TYPE zc102fit0012-bvalu,
       gv_minus       TYPE zc102fit0010-wrbtr,
       gv_total       TYPE zc102fit0010-wrbtr,
       gv_waers       TYPE waers,
       gv_lock        TYPE bool,
       gv_create_lock TYPE bool,
       gv_icon        TYPE icon_d,
       gv_docu_num    TYPE zc102fit0009-belnr,
       gv_month(2)    TYPE n.

*-- For Depreciation
DATA : gv_anln1 TYPE zc102fit0012-anln1,
       gv_deppr TYPE wrbtr.

*-- For Delete
DATA : gv_anln1_del TYPE zc102fit0007-anln1.

*-- For File Attachment
CONSTANTS : gc_typeid TYPE srgbtbrel-typeid_a VALUE 'ZC102!FI', "임의로 모듈별로 정한다
            gc_catid  TYPE srgbtbrel-catid_a  VALUE 'BO'.

DATA : gv_okcode TYPE sy-ucomm,
       gv_tabix  TYPE sy-tabix,
       gv_num    TYPE zc102fit0007-anln1,
       gv_check  TYPE bool,
       gv_select TYPE bool,
       gv_answer.

DATA : gv_cprog TYPE sy-cprog,
       gv_dynnr TYPE sy-dynnr.
