``` abap
*&---------------------------------------------------------------------*
*& Include ZC102MMR0004TOP                          - Report ZC102MMR0004
*&---------------------------------------------------------------------*
REPORT zc102mmr0004 MESSAGE-ID zc102msg.


**********************************************************************
* TYPE-POOLS
**********************************************************************
TYPE-POOLS vrm.

**********************************************************************
*TABLES
**********************************************************************
TABLES : zc102mmt0015 ,  zc102mmt0011, sscrfields,  zc102hrt0002, zc102mmt0017.

**********************************************************************
* MACRO
**********************************************************************
DEFINE _clear.
  REFRESH &1.
  CLEAR &1.

END-OF-DEFINITION.
DEFINE _range.
  &1-sign   = &2.q
  &1-option = &3.
  &1-low    = &4.
  &1-high   = &5.

  APPEND &1.
END-OF-DEFINITION.
**********************************************************************
*CLASS INSTANCE
**********************************************************************
DATA : go_container   TYPE REF TO cl_gui_custom_container,      " 메인 화면용 Custom 컨테이너
       go_split_cont  TYPE REF TO cl_gui_splitter_container,    " Splitter 컨테이너
       go_top_cont    TYPE REF TO cl_gui_container,             " 상단 컨테이너
       go_bottom_cont TYPE REF TO cl_gui_container,             " 하단 컨테이너
       go_split_cont2 TYPE REF TO cl_gui_splitter_container,    " Splitter 컨테이너
       go_left_cont   TYPE REF TO cl_gui_container,             " 좌측 컨테이너
       go_right_cont  TYPE REF TO cl_gui_container,             " 우측 컨테이너
       go_left_grid   TYPE REF TO cl_gui_alv_grid,              " 좌측 ALV 그리드 객체 (송장 업로드 목록 표시)
       go_right_grid  TYPE REF TO cl_gui_alv_grid,              " 우측 ALV 그리드 객체 (확정 보류 목록 표시)
       go_bottom_grid TYPE REF TO cl_gui_alv_grid.              " 하단 ALV 그리드 객체 (검증 확정 건 표시)

**********************************************************************
*INTERNAL TABLE AND WORKAREA
**********************************************************************
DATA : BEGIN OF gs_iv.                        " LEFT (송장 업로드 영역)
         INCLUDE STRUCTURE zc102mmt0015.      " 송장 검증 테이블 구조 포함
DATA :   prno        TYPE zc102mmt0011-prno,  " 구매요청번호
         stlno       TYPE zc102mmt0008-stlno, " 창고번호
         status      TYPE icon-id,            " 상태 아이콘
         icon_status TYPE icon_d,             " 아이콘 종류
         modi_yn,                             " 수정 여부 (Y/N)
         color       TYPE lvc_t_scol,         " 색상 지정 (신규 생성건 표시용)
         sort_key,                            " 정렬용 키
       END OF gs_iv,
       gt_iv     LIKE TABLE OF gs_iv,         " 송장 업로드 ALV 테이블
       gt_delete LIKE TABLE OF gs_iv,         " 삭제될 송장 목록
       gs_delete LIKE gs_iv.


DATA : BEGIN OF gs_check.                         " RIGHT
         INCLUDE STRUCTURE zc102mmt0015.          " 송장 검증 테이블 구조 포함
DATA :   stlno           TYPE zc102mmt0008-stlno, " 창고번호
         status          TYPE icon-id,            " 상태 아이콘 (검증 여부)
         percent         TYPE p DECIMALS 2,       " 입치율 (백분율)
         percent_txt(10),                         " 입치율 텍스트 표현
         reorder_icon    TYPE icon-id,            " 일치율 < > 100인 항목 구매오더 생성
         modi_yn,                                 " 수정 여부
         celltab         TYPE lvc_t_scol,         " 셀별 색상용
         color           TYPE lvc_t_scol,         " 전체 행 색상 지정
       END OF gs_check,
       gt_check     LIKE TABLE OF gs_check,
       gt_check_del LIKE TABLE OF gs_check,       " 삭제 대상 목록 테이블
       gs_check_del LIKE gs_check.                " 삭제 항목 단건 구조


DATA : BEGIN OF gs_iv2.                           " bottom
         INCLUDE STRUCTURE zc102mmt0015.          " 송장 검증 테이블 구조 포함
DATA :   status      TYPE icon-id,                " 상태 아이콘 (검증 여부)
         icon_status TYPE icon_d,                 " 아이콘 종류
         modi_yn,
       END OF gs_iv2,
       gt_iv2    LIKE TABLE OF gs_iv2,
       gt_del_iv LIKE TABLE OF gs_iv2,
       gs_del_iv LIKE gs_iv2.

*-- 구매오더 - 오른쪽 alv 구매오더 생성시 필요
DATA : BEGIN OF gs_po,
         ebeln    TYPE zc102mmt0011-ebeln,     " 구매오더 번호
         prno     TYPE zc102mmt0011-prno,      " 구매요청 번호
         podat    TYPE zc102mmt0011-podat,     " 구매오더 일자
         partner  TYPE zc102mmt0011-partner,   " 비즈니스파트너 번호
         matnr    TYPE zc102mmt0011-matnr,     " 자재 번호
         stprs    TYPE zc102mmt0011-stprs,     " 단가
         waers    TYPE zc102mmt0011-waers,     " 통화키
         menge    TYPE zc102mmt0011-menge,     " 수량
         meins    TYPE zc102mmt0011-meins,     " 단위
         stlno    TYPE zc102mmt0011-stlno,     " 창고 번호
         dzeit    TYPE zc102mmt0011-dzeit,     " 배송리드타임
         gredat   TYPE zc102mmt0011-gredat,    " 입고예정 일자
         empno    TYPE zc102mmt0011-empno,
         check_iv TYPE zc102mmt0011-check_iv,  " 송장검증 확정 여부
       END OF gs_po,
       gt_po LIKE TABLE OF gs_po.

DATA : BEGIN OF gs_excel,
         vbeln_bil TYPE zc102mmt0015-vbeln_bil,   " 채번하기
         ebeln     TYPE zc102mmt0015-ebeln,       " 받아오기 EXCEL에서
         partner   TYPE zc102mmt0015-partner,     " 비즈니스파트너 번호
         matnr     TYPE zc102mmt0015-matnr,       " 자재 번호
         odrqu     TYPE zc102mmt0015-odrqu,       " 주문수량
         meins     TYPE zc102mmt0015-meins,       " 단위
         qcheck   TYPE zc102mmt0015-qcheck,       " 송장검증 여부
         wrbtr     TYPE zc102mmt0015-wrbtr,       " 금액
         waers     TYPE zc102mmt0015-waers,       " 통화
         payco     TYPE zc102mmt0015-payco,       " 지급조건
         gredat    TYPE zc102mmt0015-gredat,      " 입고예정 일자
         name1     TYPE zc102mmt0015-name1,       " 거래처명
       END OF gs_excel,
       gt_excel      LIKE TABLE OF gs_excel,
       gt_excel_save LIKE TABLE OF gs_excel,
       gs_excel_save LIKE gs_excel.

DATA : gt_ldtime TYPE TABLE OF zc102mmt0004,      " 입고 리드 타임
       gs_ldtime TYPE zc102mmt0004.

DATA: p_path TYPE rlgrap-filename.

*--For ALV
*-- For ALV
DATA : gt_left_fcat      TYPE lvc_t_fcat,       " 좌측 ALV의 필드 카탈로그 테이블
       gt_right_fcat     TYPE lvc_t_fcat,       " 우측 ALV의 필드 카탈로그 테이블
       gs_left_fcat      TYPE lvc_s_fcat,       " 좌측 ALV의 단일 필드 카탈로그 항목
       gs_right_fcat     TYPE lvc_s_fcat,       " 우측 ALV의 단일 필드 카탈로그 항목
       gt_bottom_fcat    TYPE lvc_t_fcat,       " 하단 ALV의 필드 카탈로그 테이블
       gs_bottom_fcat    TYPE lvc_s_fcat,       " 하단 ALV의 단일 필드 카탈로그 항목
       gs_left_layout    TYPE lvc_s_layo,       " 좌측 ALV의 레이아웃 설정 구조
       gs_right_layout   TYPE lvc_s_layo,       " 우측 ALV의 레이아웃 설정 구조
       gs_bottom_layout  TYPE lvc_s_layo,       " 하단 ALV의 레이아웃 설정 구조
       gs_variant        TYPE disvariant.       " ALV 레이아웃 저장/불러오기용 Variant 정보 구조



DATA : gt_ui_functions TYPE ui_functions,
       gs_button       TYPE stb_button.


DATA : gv_save_flag.                            " 저장 버튼 클릭 여부 확인용 플래그 (미저장 종료 방지용)


DATA : gs_sort TYPE lvc_s_sort,                 " 정렬
       gt_sort TYPE lvc_t_sort.

DATA: gt_sort_clear TYPE lvc_t_sort,            " 새로 생긴거 맨 위로 정렬
      gs_sort_clear TYPE lvc_s_sort.


*--사원 이름 SEARCH HELP
DATA : BEGIN OF gs_empno,
         empno  TYPE zc102hrt0002-empno,        " 사원 번호
         empnam TYPE zc102hrt0002-empnam,       " 사원 이름
       END OF gs_empno,
       gt_empno LIKE TABLE OF gs_empno.         " 사원 목록 테이블

*-- 재구매오더용 테이블
DATA : gt_save TYPE TABLE OF zc102mmt0011.

**********************************************************************
* SCREEN ELEMENT
**********************************************************************
DATA : gv_cnt1 TYPE i,  " 검수 대기중 항목 건 수
       gv_cnt2 TYPE i,  " 품질 검사 미완료 항목 건 수
       gv_cnt3 TYPE i,  " 송장 검증 완료 항목 건 수
       gv_cnt4 TYPE i.  " 보류 건 수

**********************************************************************
*common value
**********************************************************************
DATA : gv_okcode TYPE sy-ucomm,                 " 사용자 커맨드 (버튼 등 동작)
       gv_tcode  TYPE sy-tcode,                 " 현재 트랜잭션 코드
       gv_file   LIKE rlgrap-filename,          " 선택된 파일 경로
       gv_answer.                               " 사용자 응답값 (예/아니오 등)

*-- 파일 경로 관련 변수
DATA : w_pickedfolder  TYPE string,             " 선택된 폴더 경로
       w_initialfolder TYPE string,             " 선택된 폴더 경로
       w_fullinfo      TYPE string,             " 전체 경로 정보
       w_pfolder       TYPE rlgrap-filename.    " 파일 경로 저장용

*-- 화면 1000에서 동작하는 버튼 기능용 변수
DATA : w_functxt TYPE smp_dyntxt,               " 버튼 텍스트 구조
       it_files  TYPE filetable,                " 선택된 파일 목록 테이블
       st_files  LIKE LINE OF it_files,         " 파일 목록의 단일 행
       w_rc      TYPE i,                        " 반환 코드
       w_dir     TYPE string.                   " 선택된 디렉터리 경로

*-- 엑셀 양식 다운로드 관련 변수
DATA : objfile       TYPE REF TO cl_gui_frontend_services, " GUI 서비스 객체
       pickedfolder  TYPE string,                          " 선택된 폴더
       initialfolder TYPE string,                          " 초기 폴더
       fullinfo      TYPE string,                          " 전체 경로 정보
       pfolder       TYPE rlgrap-filename.                 " 폴더명 저장용


*--구매오더 번호 채번 (구매오더 생성 시에)
DATA : gv_porno TYPE zc102mmt0011-ebeln,         " 채번된 구매오더 번호
       gs_porno TYPE zc102mmt0011,
       gt_porno TYPE TABLE OF zc102mmt0011.

*--송장 번호 채번
DATA : gv_vbeln TYPE zc102mmt0015-vbeln_bil,     " 채번된 송장 번호
       gs_vbeln TYPE zc102mmt0015,
       gt_vbeln TYPE TABLE OF zc102mmt0015.

*-- 전표 번호
DATA : gv_belnr TYPE zc102fit0010-belnr.          " 회계 전표 번호

DATA : gv_tabix TYPE sy-tabix.                    " 현재 내부 테이블의 index 값
