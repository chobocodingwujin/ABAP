*&---------------------------------------------------------------------*
*& Include ZC102FIR0014TOP                          - Report ZC102FIR0014
*&---------------------------------------------------------------------*
REPORT zc102fir0014 MESSAGE-ID zc102msg.

**********************************************************************
* TABLES
**********************************************************************
TABLES : zc102fit0009, zc102fit0016.

**********************************************************************
* Internal table and work area
**********************************************************************
DATA : BEGIN OF gs_header,
         bukrs TYPE zc102fit0009-bukrs, " 회사코드
         belnr TYPE zc102fit0009-belnr, " 회계전표번호
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
DATA : END OF gs_header,
       gt_header LIKE TABLE OF gs_header.

* DB 9 테이블과 같은 구조 선언 후 gt_header 값 담기
DATA : gt_header_s TYPE TABLE OF zc102fit0009,
       gs_header_s TYPE zc102fit0009.

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
* 미결 전표
DATA : gs_line TYPE zc102fit0010,
       gt_line TYPE TABLE OF zc102fit0010.
* 미결 전표의 데이터를 받기위해
DATA : gs_re_line TYPE zc102fit0010,
       gt_re_line TYPE TABLE OF zc102fit0010.
* 역분개 헤더 전표를 담기휘해
DATA : gt_reverse_s TYPE TABLE OF zc102fit0009,
       gs_reverse_s TYPE zc102fit0009.

* f4
DATA : BEGIN OF gs_reverse_code,
         stgrd TYPE zc102fit0006-stgrd,
         txt50 TYPE zc102fit0006-txt50,
       END OF gs_reverse_code,
       gt_reverse_code LIKE TABLE OF gs_reverse_code.

**********************************************************************
* Common variable
**********************************************************************
DATA : gv_okcode TYPE sy-ucomm.

**********************************************************************
* Screen painter variable
**********************************************************************
DATA : gv_bukrs   TYPE zc102fit0009-bukrs,
       gv_gjahr   TYPE zc102fit0009-gjahr,
       gv_belnr   TYPE zc102fit0009-belnr,
       gv_budat   TYPE zc102fit0009-budat,
       gv_reverse TYPE zc102fit0009,
       gv_code    TYPE zc102fit0006-stgrd.

DATA: gv_number        TYPE n LENGTH 10, " 도메인의 길이에 맞게
      gv_prefix(3),                  " PPO, PDO 등
      gv_full_code     TYPE string,
      gv_range_nr      TYPE inri-nrrangenr,
      gv_quantity      TYPE inri-quantity,
      gv_reverse_belnr TYPE string.
