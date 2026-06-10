``` abap
*&---------------------------------------------------------------------*
*& Include ZC102FIR0006TOP                          - Report ZC102FIR0006
*&---------------------------------------------------------------------*
REPORT zc102fir0006.

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

**********************************************************************
* COMMON VARIABLE
**********************************************************************
*-- For Depreciation
DATA : gv_anln1 TYPE zc102fit0012-anln1,
       gv_deppr TYPE wrbtr.

DATA : gv_tabix TYPE sy-tabix.
