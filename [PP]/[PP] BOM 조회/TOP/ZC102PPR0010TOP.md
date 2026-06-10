``` abap
*&---------------------------------------------------------------------*
*& Include ZC102PPR0010TOP                          - Report ZC102PPR0010
*&---------------------------------------------------------------------*
REPORT zc102ppr0010 MESSAGE-ID zc102msg.


**********************************************************************
* Declaration area for NODE
**********************************************************************
TYPES: node_table_type LIKE STANDARD TABLE OF mtreesnode
                       WITH DEFAULT KEY.
DATA: node_table TYPE node_table_type.

**********************************************************************
* Declaration area for GUI Class instance
**********************************************************************
DATA: go_container  TYPE REF TO cl_gui_docking_container,
      go_base_cont  TYPE REF TO cl_gui_easy_splitter_container,
      go_left_cont  TYPE REF TO cl_gui_container,
      go_right_cont TYPE REF TO cl_gui_container,
      go_alv_grid   TYPE REF TO cl_gui_alv_grid,
      go_tree       TYPE REF TO cl_gui_simple_tree.

**********************************************************************
* Declaration area for Tree event
**********************************************************************
DATA: events TYPE cntl_simple_events,
      event  TYPE cntl_simple_event.

**********************************************************************
* Declaration area for common variable
**********************************************************************
DATA: BEGIN OF gs_tr_bom,
        header_bomno TYPE zc102ppt0003-bomno,
        bomno        TYPE zc102e_pp_bomno,
        matnr        TYPE zc102e_mm_matnr,
        maktx        TYPE zc102mmt0004-maktx,
      END OF gs_tr_bom,
      gt_tr_bom LIKE TABLE OF gs_tr_bom.

DATA: BEGIN OF gs_bom.
        INCLUDE STRUCTURE zc102mmt0001.
DATA :  bomno TYPE zc102e_pp_bomno,
        maktx TYPE zc102mmt0004-maktx,
      END OF gs_bom,
      gt_bom LIKE TABLE OF gs_bom.

DATA : BEGIN OF gs_matnr,
         matnr TYPE zc102mmt0004-matnr,
         maktx TYPE zc102mmt0004-maktx,
       END OF gs_matnr,
       gt_matnr LIKE TABLE OF gs_matnr.

DATA : BEGIN OF gs_bom_master,
         bomno TYPE zc102ppt0003-bomno,
         matnr TYPE zc102ppt0003-matnr,
       END OF gs_bom_master,
       gt_bom_master LIKE TABLE OF gs_bom_master.

DATA: gv_okcode  TYPE sy-ucomm,
      gs_layout  TYPE lvc_s_layo,
      gv_cprog   TYPE sy-cprog,
      gv_dynnr   TYPE sy-dynnr,
      gt_fcat    TYPE lvc_t_fcat,
      gs_fcat    TYPE lvc_s_fcat,
      gs_variant TYPE disvariant.
