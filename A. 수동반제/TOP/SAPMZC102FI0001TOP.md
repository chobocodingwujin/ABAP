``` abap
*&---------------------------------------------------------------------*
*& Include SAPMZC102FI0001TOP                       - Module Pool      SAPMZC102FI0001
*&---------------------------------------------------------------------*
PROGRAM sapmzc102fi0001 MESSAGE-ID zc102msg.

**********************************************************************
* TABLES
**********************************************************************
TABLES : zc102fit0009, zc102fit0010, zc102fit0016.

**********************************************************************
* Macro
**********************************************************************
DEFINE  _init.

  REFRESH &1.
  CLEAR &1.

END-OF-DEFINITION.

**********************************************************************
* Screen field
**********************************************************************
DATA : gv_bukrs TYPE bkpf-bukrs, " 회사코드
       gv_gjahr TYPE bkpf-gjahr, " 회계연도
       gv_belnr TYPE bkpf-belnr. " 회계전표

**********************************************************************
* Class instance
**********************************************************************
DATA : go_base_container  TYPE REF TO cl_gui_custom_container.

DATA : go_split_cont      TYPE REF TO cl_gui_splitter_container,

       go_top_cont        TYPE REF TO cl_gui_container,
       go_bottom_cont     TYPE REF TO cl_gui_container,

       go_top_alv_grid    TYPE REF TO cl_gui_alv_grid,
       go_bottom_alv_grid TYPE REF TO cl_gui_alv_grid.
**********************************************************************
* Internal table and Work area
**********************************************************************
DATA : BEGIN OF gs_header,
         status TYPE icon-id,
         bukrs  TYPE zc102fit0009-bukrs, " 회사코드
         belnr  TYPE zc102fit0009-belnr, " 전표번호
         gjahr  TYPE zc102fit0009-gjahr, " 회계연도
         blart  TYPE zc102fit0009-blart, " 계정유형
         bldat  TYPE zc102fit0009-bldat, " 증빙일
         budat  TYPE zc102fit0009-budat, " 전기일
         bktxt  TYPE zc102fit0009-bktxt, " 전표헤더텍스트
         stblg  TYPE zc102fit0009-stblg, " 역분개전표번호
         waers  TYPE zc102fit0009-waers, " 통화키
         augdt  TYPE zc102fit0010-augdt, " 반제일
         augbl  TYPE zc102fit0010-augbl, " 반제전표번호
         ebeln  TYPE zc102fit0010-ebeln, " 구매오더번호
         vbeln  TYPE zc102fit0010-vbeln. " 판매오더번호
         INCLUDE STRUCTURE zc102cms0001.  " 타임스탬프
DATA : END OF gs_header.
DATA : gt_header LIKE TABLE OF gs_header.

DATA : gt_header_s TYPE TABLE OF zc102fit0009,
       gs_header_s TYPE zc102fit0009.

*-- bottom alv
DATA : BEGIN OF gs_clear,
         bukrs   TYPE zc102fit0016-bukrs, " 회사코드
         augbl   TYPE zc102fit0016-augbl, " 반제전표
*        미결전표번호->원전표 번호/전표번호-> 반제전표번호
         belnr   TYPE zc102fit0016-belnr, " 회계전표
         gjahr   TYPE zc102fit0016-gjahr, " 회계연도
         buzei   TYPE zc102fit0016-buzei, " 개별항목전표번호
         saknr   TYPE zc102fit0016-saknr, " 계정과목
         txt20   TYPE zc102fit0002-txt20, " 계정설명
         augdt   TYPE zc102fit0016-augdt, " 반제일
         bschl   TYPE zc102fit0016-bschl, " 전기키
         rebzg   TYPE zc102fit0016-rebzg, " 원전표번호 <- 미결전표
         shkzg   TYPE zc102fit0016-shkzg, " 차대지시자
         koart   TYPE zc102fit0016-koart, " 계정유형
         partner TYPE zc102fit0016-partner, " BP파트너
         sgtxt   TYPE zc102fit0016-sgtxt, " 아이템텍스트
         dmbtr   TYPE zc102fit0016-dmbtr, " 환율환산금액
         wrbtr   TYPE zc102fit0016-wrbtr, " 금액
         waers   TYPE zc102fit0016-waers, " 통화키
         ebeln   TYPE zc102fit0016-ebeln, " 구매오더번호
         vbeln   TYPE zc102fit0016-vbeln, " 판매오더번호
         bpact   TYPE zc102fit0016-bpact. " 고객계정
*         duedt   TYPE zc102fit0016-duedt. " 지급기한
         INCLUDE STRUCTURE zc102cms0001.  " 타임스탬프
DATA : END OF gs_clear.
DATA : gt_clear LIKE TABLE OF gs_clear.

DATA : gt_clear_s TYPE TABLE OF zc102fit0016, " 반제전표 데이터
       gs_clear_s TYPE zc102fit0016.

DATA : gs_header_dz TYPE zc102fit0009, " 매출채권 데이터 담기위함
       gs_header_kz TYPE zc102fit0009. " 매입채무 데이터 담기위함

*-- BP계정 조정계정을 고객 계정으로 대체
DATA : gt_bp TYPE TABLE OF zc102bpt0002,
       gs_bp TYPE zc102bpt0002.

*-- G/L 계정정보 계정과목 번호와 텍스트 가져오기
DATA : gt_gl TYPE TABLE OF zc102fit0002,
       gs_gl TYPE zc102fit0002.

*-- 전기키 마스터 테이블
DATA : gt_bschl TYPE TABLE OF zc102fit0004,
       gs_bschl TYPE zc102fit0004.

*-- header top alv catalog
DATA : gt_top_fcat    TYPE lvc_t_fcat,
       gs_top_fcat    TYPE lvc_s_fcat,
       gt_top_sort    TYPE lvc_t_sort,
       gs_top_sort    TYPE lvc_s_sort,
       gs_top_layout  TYPE lvc_s_layo,
       gs_top_variant TYPE disvariant.

*-- top alv
DATA : BEGIN OF gs_suspense,
         status  TYPE icon-id,            " 미결 상태
         bukrs   TYPE zc102fit0010-bukrs, " 회사코드
         belnr   TYPE zc102fit0010-belnr, " 전표번호
         gjahr   TYPE zc102fit0010-gjahr, " 회계연도
         buzei   TYPE zc102fit0010-buzei, " 개별항목전표번호
         saknr   TYPE zc102fit0010-saknr, " 계정과목
         txt20   TYPE zc102fit0002-txt20, " 계정과목설명
         blart   TYPE zc102fit0009-blart, " 계정유형
         budat   TYPE zc102fit0009-budat, " 전기일
         augdt   TYPE zc102fit0010-augdt, " 반제일
         augbl   TYPE zc102fit0010-augbl, " 반제전표번호
         bschl   TYPE zc102fit0010-bschl, " 전기키
         shkzg   TYPE zc102fit0010-shkzg, " 차/대지시자
         koart   TYPE zc102fit0010-koart, " 계정유형
         partner TYPE zc102fit0010-partner, " BP파트너
         dmbtr   TYPE zc102fit0010-dmbtr, " 환율 환산 금액
         sgtxt   TYPE zc102fit0010-sgtxt, " 아이템텍스트
         wrbtr   TYPE zc102fit0010-wrbtr, " 금액
         waers   TYPE zc102fit0010-waers, " 통화키
         bldat   TYPE zc102fit0009-bldat, " 증빙일
         ebeln   TYPE zc102fit0010-ebeln, " 구매오더번호
         vbeln   TYPE zc102fit0010-vbeln, " 판매오더번호
         bpact   TYPE zc102fit0010-bpact. " 고객계정
         INCLUDE STRUCTURE zc102cms0001.
DATA : END OF gs_suspense.
DATA : gt_suspense LIKE TABLE OF gs_suspense.

DATA : gt_suspense_s TYPE TABLE OF zc102fit0010,
       gs_suspense_s TYPE zc102fit0010.

*-- 메모리 아이디 받아오려고 설정
DATA : BEGIN OF gs_header_mm,
         bukrs TYPE zc102fit0009-bukrs, " 회사코드
         belnr TYPE zc102fit0009-belnr, " 전표번호
         gjahr TYPE zc102fit0009-gjahr, " 회계연도
         blart TYPE zc102fit0009-blart, " 전표유형
         bldat TYPE zc102fit0009-bldat, " 증빙일
         budat TYPE zc102fit0009-budat, " 전기일
         bktxt TYPE zc102fit0009-bktxt, " 전표헤더텍스트
         stblg TYPE zc102fit0009-stblg, " 역분개전표번호
         stodt TYPE zc102fit0009-stodt, " 역분개전기계획일
         stgrd TYPE zc102fit0009-stgrd, " 역분개사유코드
*         augbl TYPE zc102fit0010-augbl, " 반제전표번호
         waers TYPE zc102fit0009-waers, " 통화
       END OF gs_header_mm.

*-- clear bottom alv catalog
DATA : gt_bottom_fcat    TYPE lvc_t_fcat,
       gs_bottom_fcat    TYPE lvc_s_fcat,
       gt_bottom_sort    TYPE lvc_t_sort,
       gs_bottom_sort    TYPE lvc_s_sort,
       gs_bottom_layout  TYPE lvc_s_layo,
       gs_bottom_variant TYPE disvariant.

DATA : gs_button       TYPE stb_button.
**********************************************************************
* Comman variable
**********************************************************************
DATA : gv_okcode TYPE sy-ucomm.

DATA: gv_number      TYPE n LENGTH 10, " 도메인의 길이에 맞게
      gv_prefix(3),                  " PPO, PDO 등
      gv_full_code   TYPE string,
      gv_range_nr    TYPE inri-nrrangenr,
      gv_quantity    TYPE inri-quantity,
      gv_clear_belnr TYPE string.
