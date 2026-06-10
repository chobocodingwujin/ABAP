sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    'sap/ui/model/odata/v2/ODataModel',
    "sap/m/Button",
    "sap/m/library",
    "sap/m/Dialog",
    "sap/m/Text",
], (Controller, MessageToast, ODataModel, Button, Library, Dialog, Text) => {
    "use strict";

    return Controller.extend("bpcontrol.bpcontrol.controller.BP_Edit", {
        onInit() {

            let oRouter = this.getOwnerComponent().getRouter();
            //라우팅 후 데이터 세팅
            oRouter.getRoute("RouteBP_Edit").attachPatternMatched(this._onObjectMatched, this);

            this._loadingSearchHelp("PgroupSet", "groups", "");
            this._loadingSearchHelp("CountrySet", "countries", "");
            this._loadingSearchHelp("MatnrSet", "matnr", "");
            this._loadingSearchHelp("MatnrSet", "cusmatnr", "P");
        },

        _onObjectMatched: function (oEvent) {
            let oComponent = this.getOwnerComponent();
            let oODataModel = oComponent.getModel(); // ODataModel
            let oView = this.getView();

            let sPartnerId = oEvent.getParameter("arguments").partnerId;
            let sBasePath = `/BpSet('${sPartnerId}')`;

            oODataModel.read(sBasePath, {
                urlParameters: {
                    "$expand": "to_Bank,to_Credit,to_Customer,to_Vendor,to_Matnr,to_CusMatnr"
                },
                success: (oData) => {
                    const mimeType = oData.Mimetype;
                    const base64 = oData.ImageData; // base64 encoded string
                    const imageSrc = `data:${mimeType};base64,${base64}`;
                    oData.imageSrc = imageSrc;

                    // 1. Address 자동 선택
                    let sCustomerAddr = oData?.to_Customer.results[0]?.Stras;
                    let sVendorAddr = oData?.to_Vendor.results[0]?.Stras;
                    oData.Address = sCustomerAddr || sVendorAddr || "주소 없음";
                    // let sCustomerAddr = oData?.to_Customer.results[0]?.Stras;
                    // let sVendorAddr = oData?.to_Vendor.results[0]?.Stras;
                    // oData.Address = sCustomerAddr || sVendorAddr || "주소 없음";

                    // 2. Phone 가공
                    let sCustomerPhone = oData.to_Customer.results[0]?.Telf1;
                    let sVendorPhone = oData.to_Vendor.results[0]?.Telf1;
                    let phone = sCustomerPhone || sVendorPhone || "연락처 없음";
                    oData.Phone = phone;

                    // 3. Email 가공
                    let sCustomerEmail = oData.to_Customer?.Email;
                    let sVendorEmail = oData.to_Vendor?.Email;
                    // oData.Email = sCustomerEmail || sVendorEmail || "주소 없음";


                    // 4. 국가, 도시 세팅
                    let city = oData.Address.split(" ").slice(0, 1).join(" ");
                    let addr = city + ", " + oData.Landx;
                    // this.getView().byId("address").setText(addr);

                    // 9. 지도 세팅
                    let sMapUrl = `https://www.google.com/maps?q=${encodeURIComponent(oData.Address)}&output=embed`;
                    let sIframe = `<iframe width="500" height="300" style="border:0" src="${sMapUrl}"></iframe>`;
                    // this.byId("mapContainer").setContent(sIframe);

                    // 10. 잔여 여신 한도 세팅
                    let calcResult = oData.to_Credit?.CreditLimit - oData.to_Credit?.CreditUsed;
                    if (isNaN(calcResult)) {
                        // oData.to_Credit.CreditRemain = 0;
                    }
                    else {
                        oData.to_Credit.CreditRemain = calcResult;
                        if (calcResult < 0) {
                            oData.to_Credit.CreditStatus = "sap-icon://status-negative";
                            oData.StatusIcon = "sap-icon://employee-rejections";
                            oData.StatusText = "Disabled"
                            oData.to_Credit.status = "Error";
                        }
                        else {
                            oData.to_Credit.CreditStatus = "sap-icon://status-positive";
                            oData.StatusIcon = "sap-icon://employee-approvals";
                            oData.StatusText = "Avaliable"
                            oData.to_Credit.status = "Success";
                        }
                    }

                    // 모델 바인딩
                    let oFinalModel = new sap.ui.model.json.JSONModel(oData);

                    oView.setModel(oFinalModel, "PartnerSet");

                    console.log("✅ 파트너 전체 데이터:", oFinalModel.getData());
                    this.setInit();
                    // 여신 정보 세팅
                    //날짜 세팅
                    let oNow = new Date();

                    // 날짜: yyyy-MM-dd
                    let sDate = oNow.toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit"
                    }).replace(/\. /g, '-').replace('.', '');

                    // 시간: HH:mm
                    let sTime = oNow.toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false
                    });

                    const oModelSearch = this.getView().getModel("BpSearch");
                    const oDataObject = {};
                    let aGroups = [];
                    if (oData.BpRole === 'D') {
                        // item = { "고객/거래처"
                        aGroups.push(
                            {
                                rKey: "D",
                                rName: "고객/거래처"
                            }

                        );
                    } else if (oData.BpRole === 'C') {
                        aGroups.push(
                            {
                                rKey: "D",
                                rName: "고객/거래처"
                            },
                            {
                                rKey: "C",
                                rName: "고객"
                            }
                        );
                    } else {
                        aGroups.push(
                            {
                                rKey: "D",
                                rName: "고객/거래처"
                            },
                            {
                                rKey: "V",
                                rName: "거래처"
                            }
                        )
                    }

                    if (oModelSearch) {
                        oModelSearch.setProperty('/BpRole', aGroups);
                        console.log(aGroups);
                    }
                    console.log(oModelSearch);
                },
                error: (err) => {
                    console.error("❌ Partner 조회 실패:", err);
                }
            });
        },

        setInit() {

            const oModel = this.getView().getModel("PartnerSet");
            const oData = oModel.getData();
            const oBpModel = this.getView().getModel("BpSearch");
            const aMatnrList = oBpModel.getProperty("/matnr");

            // 1. BP 공통 정보 세팅
            const mimeType = oData.Mimetype;
            const base64 = oData.ImageData; // base64 encoded string
            oData.Address = oData.Address || "주소 없음";
            let imageSrc = `data:${mimeType};base64,${base64}`;
            if (!base64) {
                imageSrc = "data:image/png;base64,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";
            }
            let oModelPartner = new sap.ui.model.json.JSONModel({
                ImagePreviewSrc: imageSrc,
                Name1: oData.Name1,
                Stras: oData.Address,
                Detail: "",
                Land1: oData.Land1,
                Telf1: oData.Phone,
                Email: oData.Email,
                BpGroup: oData.BpGroup,
                BpRole: oData.BpRole,
                BpType: oData.BpType,
                ShowCustomer: oData?.to_Customer?.results?.length > 0,
                ShowVendor: oData?.to_Vendor?.results?.length > 0
            });

            // 2. 고객 세팅
            let oModelCustomer = new sap.ui.model.json.JSONModel({
                Waers: !!oData.to_Customer.results[0]?.Waers ? oData.to_Customer.results[0].Waers : "KRW",
                Knkli: !!oData.to_Customer.results[0]?.Knkli ? oData.to_Customer.results[0].Knkli : "VVIP",
                Ctlzl: "A"
            });

            // 3. 거래처 계좌 세팅
            oData.to_Bank?.results?.forEach(item => {
                item.IsInit = false;
            });
            let oModelAccount = new sap.ui.model.json.JSONModel({
                accountList: !!oData.to_Bank?.results ? oData.to_Bank.results : []
            });
            oModelAccount.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);

            // 4. 거래처 세팅
            let oModelVendor = new sap.ui.model.json.JSONModel({
                Waers: "KRW",
                Knkli: !!oData.to_Vendor.results[0]?.Knkli ? oData.to_Vendor.results[0].Knkli : "A"
            });

            // 5. 거래처-자재 세팅
            oData.to_Matnr?.results?.forEach(item => {
                const match = aMatnrList.find(mat => mat.Matnr === item.Matnr);
                item.Ddtext = match?.Ddtext || ""; // 매칭 안되면 빈 문자열
                item.IsInit = false;
            });
            let oModelMatnr = new sap.ui.model.json.JSONModel({
                matnrList: oData.to_Matnr?.results ? oData.to_Matnr?.results : []
            });
            oModelMatnr.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);

            // 6. 고객 판매 품목 세팅
            oData.to_CusMatnr?.results?.forEach(item => {
                item.IsInit = false;
            });
            let oModelCusMatnr = new sap.ui.model.json.JSONModel({
                matnrList: oData.to_CusMatnr?.results ? oData.to_CusMatnr?.results : []
            });
            oModelCusMatnr.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);

            let oDate = oData.to_Credit?.LastUpdated ? oData.to_Credit?.LastUpdated : new Date();
            let pad = (n, length = 2) => n.toString().padStart(length, '0');

            let yyyy = oDate.getFullYear();
            let MM = pad(oDate.getMonth() + 1); // 월은 0부터 시작
            let dd = pad(oDate.getDate());
            let hh = pad(oDate.getHours());
            let mm = pad(oDate.getMinutes());
            let ss = pad(oDate.getSeconds());
            let ms = oDate.getMilliseconds().toString().padEnd(7, '0'); // 7자리 맞춤

            let formattedDate = `${yyyy}.${MM}.${dd} ${hh}:${mm}:${ss}.${ms}`;

            // 7. 고객 여신 세팅
            let oModelCredit = new sap.ui.model.json.JSONModel({
                CreditLimit: oData.to_Credit?.CreditLimit ? Number(oData.to_Credit?.CreditLimit).toLocaleString("en-US") : "",
                LastUpdated: formattedDate
            });

            this.getView().setModel(oModelPartner, "CreateBPModel");
            this.getView().setModel(oModelCustomer, "CreateCustomerModel");
            this.getView().setModel(oModelCredit, "CreateCreditModel");
            this.getView().setModel(oModelAccount, "CreateAccountModel");
            this.getView().setModel(oModelVendor, "CreateVendorModel");
            this.getView().setModel(oModelMatnr, "CreateMatnrModel");
            this.getView().setModel(oModelCusMatnr, "CreateCusMatnrModel");
        },

        // 이미지 변경경
        onImageChange: function (oEvent) {
            const oFile = oEvent.getParameter("files")[0];
            if (oFile && FileReader) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const base64Full = e.target.result;                  // "data:image/png;base64,..."
                    const base64 = base64Full.split(",")[1];             // base64 only
                    const mimeType = oFile.type;
                    const fileName = oFile.name;
                    // 모델의 /ImageUrl에 저장 → 미리보기 반영
                    // this.getView().getModel("CreateBPModel").setProperty("/ImageData", base64);
                    const oModel = this.getView().getModel("CreateBPModel");
                    oModel.setProperty("/ImagePreviewSrc", base64Full); // ✅ 전체 URI 형태
                    oModel.setProperty("/ImageData", base64); // binary 형식 (optional)
                    oModel.setProperty("/ImageUrl", fileName);
                    oModel.setProperty("/Mimetype", mimeType);

                }.bind(this);
                reader.readAsDataURL(oFile);

            }
        },

        // BpRole 변경 시 조건에 맞게 탭 변경경
        onBpRoleChange: function (oEvent) {
            const sRole = oEvent.getSource().getSelectedKey();
            const oModel = this.getView().getModel("CreateBPModel");

            // 역할에 따라 탭 표시 여부 제어
            oModel.setProperty("/ShowCustomer", sRole === "C" || sRole === "D");
            oModel.setProperty("/ShowVendor", sRole === "V" || sRole === "D");

            console.log(oModel);
        },

        // 여신 금액 변경 시 , 자동 생성성
        onCreditLimitChange: function (oEvent) {
            const oInput = oEvent.getSource();
            let sValue = oInput.getValue();

            if (sValue) {
                oInput.setValueState("None");
            }

            // 숫자만 추출
            sValue = sValue.replace(/[^\d]/g, "");

            // 숫자가 없으면 빈값 처리
            if (!sValue) {
                oInput.setValue("");
                this.getView().getModel("CreateCreditModel").setProperty("/CreditLimit", "");
                return;
            }

            // 콤마 붙이기
            const sFormatted = Number(sValue).toLocaleString("en-US");

            // 입력창에 표시
            oInput.setValue(sFormatted);

            // 모델에도 원시 숫자 저장 (필요 시 문자열 그대로 저장도 가능)
            this.getView().getModel("CreateCreditModel").setProperty("/CreditLimit", sFormatted);
        },

        // 고객-제품 새로 생성
        onCreateCusMat: function () {
            const oModel = this.getView().getModel("CreateCusMatnrModel");
            const aOldData = oModel.getProperty("/matnrList") || [];

            // 새로운 행 추가
            const aNewData = [...aOldData, {
                IsInit: true,
                Matnr: "M0001",
                Maktx: "포장 소고기",
                Mtart: "P",
                Ddtext: "완제품",
                Stprs: "1000",
                Waers: "KRW",
                Contype: "C"
            }];

            // UI가 반응하도록 새 배열로 덮어쓰기
            oModel.setProperty("/matnrList", aNewData);

            console.log("✔️ 현재 항목 수:", oModel.getData());
        },

        // 고객-제품 삭제
        onDeleteCusMat: function () {
            const oTable = this.byId("custmatCreateTableEdit");
            let oModel = this.getView().getModel("CreateCusMatnrModel");

            const aSelectedIndices = oTable.getSelectedIndices(); // 선택된 행의 인덱스 배열
            if (aSelectedIndices.length === 0) {
                sap.m.MessageToast.show("삭제할 항목을 선택하세요.");
                return;
            }

            // 기존 데이터 가져오기
            let aData = oModel.getProperty("/matnrList");

            // 삭제 대상 인덱스 필터링: IsInit === true인 것만
            const aFilteredIndices = aSelectedIndices.filter(i => aData[i].IsInit === true);

            if (aFilteredIndices.length === 0) {
                sap.m.MessageToast.show("새로 생성한 항목만 삭제할 수 있습니다.");
                return;
            }

            // 역순으로 삭제 (인덱스 밀림 방지)
            aFilteredIndices.sort((a, b) => b - a).forEach(i => {
                aData.splice(i, 1);
            });

            // 인덱스 재정렬
            aData = aData.map((item, idx) => {
                item.Index = idx + 1;
                return item;
            });

            // 모델에 반영
            oModel.setProperty("/matnrList", aData);

            // 선택 해제
            oTable.clearSelection();
        },

        // 고객-제품 변경
        onCusMatnrChange: function (oEvent) {
            const oSelectedItem = oEvent.getParameter("selectedItem");
            const sSelectedKey = oEvent.getParameter("selectedItem").getKey();

            // BpSearch 모델에서 전체 자재 목록 가져오기
            const oBpModel = this.getView().getModel("BpSearch");
            const aMatnrList = oBpModel.getProperty("/cusmatnr");

            // 선택된 Matnr에 해당하는 객체 찾기
            const oSelectedMatnr = aMatnrList.find(item => item.Matnr === sSelectedKey);
            if (!oSelectedMatnr) return;

            // 현재 바인딩된 행 경로 얻기 (CreateMatnrModel>/matnrList/0 ...)
            const sRowPath = oEvent.getSource().getBindingContext("CreateCusMatnrModel").getPath();
            const oCreateModel = this.getView().getModel("CreateCusMatnrModel");

            // 해당 행의 필드 업데이트
            console.log(sRowPath + "/Maktx", oSelectedMatnr.Maktx);
            oCreateModel.setProperty(sRowPath + "/Maktx", oSelectedMatnr.Maktx);
            oCreateModel.setProperty(sRowPath + "/Mtart", oSelectedMatnr.Mtart);
            oCreateModel.setProperty(sRowPath + "/Ddtext", oSelectedMatnr.Ddtext);
        },

        // 거래처-자재 생성
        onCreate: function () {
            const oModel = this.getView().getModel("CreateMatnrModel");
            const aOldData = oModel.getProperty("/matnrList") || [];

            // 새로운 행 추가
            const aNewData = [...aOldData, {
                IsInit: true,
                Matnr: "M0001",
                Maktx: "포장 소고기",
                Mtart: "P",
                Ddtext: "완제품",
                Stprs: "1000",
                Waers: "KRW",
                Contype: "V"
            }];

            // UI가 반응하도록 새 배열로 덮어쓰기
            oModel.setProperty("/matnrList", aNewData);

            console.log("✔️ 현재 항목 수:", oModel.getProperty("/matnrList"));
        },

        // 거래처-자재 삭제제
        onDelete: function () {
            const oTable = this.byId("matnrCreateTableEdit");
            let oModel = this.getView().getModel("CreateMatnrModel");

            const aSelectedIndices = oTable.getSelectedIndices(); // 선택된 행의 인덱스 배열
            if (aSelectedIndices.length === 0) {
                sap.m.MessageToast.show("삭제할 항목을 선택하세요.");
                return;
            }

            // 기존 데이터 가져오기
            let aData = oModel.getProperty("/matnrList");

            // 삭제 대상 인덱스 필터링: IsInit === true인 것만
            const aFilteredIndices = aSelectedIndices.filter(i => aData[i].IsInit === true);

            if (aFilteredIndices.length === 0) {
                sap.m.MessageToast.show("새로 생성한 항목만 삭제할 수 있습니다.");
                return;
            }

            // 역순으로 삭제 (인덱스 밀림 방지)
            aFilteredIndices.sort((a, b) => b - a).forEach(i => {
                aData.splice(i, 1);
            });

            // 인덱스 재정렬
            aData = aData.map((item, idx) => {
                item.Index = idx + 1;
                return item;
            });

            // 모델에 반영
            oModel.setProperty("/matnrList", aData);

            // 선택 해제
            oTable.clearSelection();
        },

        // 거래처-자재 변경경
        onMatnrChange: function (oEvent) {
            const oSelectedItem = oEvent.getParameter("selectedItem");
            const sSelectedKey = oEvent.getParameter("selectedItem").getKey();

            // BpSearch 모델에서 전체 자재 목록 가져오기
            const oBpModel = this.getView().getModel("BpSearch");
            const aMatnrList = oBpModel.getProperty("/matnr");

            // 선택된 Matnr에 해당하는 객체 찾기
            const oSelectedMatnr = aMatnrList.find(item => item.Matnr === sSelectedKey);
            if (!oSelectedMatnr) return;

            // 현재 바인딩된 행 경로 얻기 (CreateMatnrModel>/matnrList/0 ...)
            const sRowPath = oEvent.getSource().getBindingContext("CreateMatnrModel").getPath();
            const oCreateModel = this.getView().getModel("CreateMatnrModel");

            // 해당 행의 필드 업데이트
            console.log(aMatnrList);
            oCreateModel.setProperty(sRowPath + "/Maktx", oSelectedMatnr.Maktx);
            oCreateModel.setProperty(sRowPath + "/Mtart", oSelectedMatnr.Mtart);
            oCreateModel.setProperty(sRowPath + "/Ddtext", oSelectedMatnr.Ddtext);
        },

        // 거래처 계좌 생성성
        onCreateAcc: function () {
            const oModel = this.getView().getModel("CreateAccountModel");
            const aOldData = oModel.getProperty("/accountList") || [];

            // 새로운 행 추가
            const aNewData = [...aOldData, {
                IsInit: true,
                Bank: "YR",
                OwnerType: "BP",
                Accnum: "",
                Waers: "KRW"
            }];

            // UI가 반응하도록 새 배열로 덮어쓰기
            oModel.setProperty("/accountList", aNewData);

            console.log("✔️ 현재 항목 수:", oModel);
        },

        // 거래처 계좌 삭제
        onDeleteAcc: function () {
            const oTable = this.byId("accountCreateTableEdit");
            const oModel = this.getView().getModel("CreateAccountModel");

            const aSelectedIndices = oTable.getSelectedIndices(); // 선택된 행의 인덱스 배열
            if (aSelectedIndices.length === 0) {
                sap.m.MessageToast.show("삭제할 항목을 선택하세요.");
                return;
            }

            // 기존 데이터 가져오기
            let aData = oModel.getProperty("/accountList");

            // 삭제 대상 인덱스 필터링: IsInit === true인 것만
            const aFilteredIndices = aSelectedIndices.filter(i => aData[i].IsInit === true);

            if (aFilteredIndices.length === 0) {
                sap.m.MessageToast.show("새로 생성한 항목만 삭제할 수 있습니다.");
                return;
            }

            // 역순으로 삭제 (인덱스 밀림 방지)
            aFilteredIndices.sort((a, b) => b - a).forEach(i => {
                aData.splice(i, 1);
            });

            // 인덱스 재정렬
            aData = aData.map((item, idx) => {
                item.Index = idx + 1;
                return item;
            });

            // 모델에 반영
            oModel.setProperty("/matnrList", aData);

            // 선택 해제
            oTable.clearSelection();
        },

        // 거래처 은행 변경경
        onChangeBank: function (oEvent) {
            const oSelect = oEvent.getSource();
            const sSelectedKey = oEvent.getParameter("selectedItem").getKey();

            const oContext = oSelect.getBindingContext("CreateAccountModel");
            const sPath = oContext.getPath(); // 예: "/accountList/1"

            const oModel = oContext.getModel();
            oModel.setProperty(sPath + "/Bank", sSelectedKey);
        },

        // 거래처 계좌번호 변경경
        onChangeAccnum: function (oEvent) {
            const oInput = oEvent.getSource();
            const sOriginalValue = oEvent.getParameter("value");

            // 숫자만 남기기
            const sCleaned = sOriginalValue.replace(/\D/g, ""); // 숫자 외 제거

            // 모델 경로 (eg. /accountList/0)
            const oContext = oInput.getBindingContext("CreateAccountModel");
            const sRowPath = oContext.getPath(); // "/accountList/0"

            const oModel = oContext.getModel();
            oModel.setProperty(sRowPath + "/Accnum", sCleaned);
        },

        // 주소검색
        onSearchAddressPopup: function () {
            // 팝업 열기
            const sPath = sap.ui.require.toUrl("bpcontrol/bpcontrol/goPopup.html");
            window.open(sPath, "주소검색", "width=500,height=600");
            // window.open("goPopup.html", "주소검색", "width=500,height=600");

            // 주소 선택 결과 받기
            window.addEventListener("message", function (oEvent) {
                const sAddress = oEvent.data.roadAddr; // ← 정확한 키 이름
                if (sAddress) {
                    this.getView().getModel("CreateBPModel").setProperty("/Stras", sAddress);
                }
            }.bind(this));
        },

        // Search Help 로딩
        _loadingSearchHelp: function (code, keyName, filter) {
            const oModel = this.getOwnerComponent().getModel();
            const oView = this.getView();
            const filter2 = filter;
            // console.log(code, keyName, filter);
            oModel.read(`/${code}`, {
                success: function (oData) {
                    if (oData) {
                        let aGroups = Object.values(oData.results);
                        // filter가 'P'인 경우 Mtart가 'P'인 항목만 필터링
                        if (filter2 == 'P') {
                            aGroups = aGroups.filter(item => item.Mtart === filter2);
                        }
                        // keyName으로 동적 key 설정
                        const oModel = oView.getModel("BpSearch");
                        const oDataObject = {};
                        oDataObject[keyName] = aGroups;
                        if (oModel) {
                            oModel.setProperty(`/${keyName}`, aGroups);
                        }
                        else {
                            const oGroupModel = new sap.ui.model.json.JSONModel(oDataObject);
                            oView.setModel(oGroupModel, "BpSearch");  // e.g., "BpSearch"
                        }
                    }
                },
                error: function () {
                    sap.m.MessageToast.show("서치 헬프를 불러오지 못했습니다.");
                }
            });
        },

        onBack() {
            let ButtonType = Library.ButtonType;
            let DialogType = Library.DialogType;
            if (!this.oApproveDialog) {
                this.oApproveDialog = new Dialog({
                    type: DialogType.Message,
                    title: "취소",
                    content: new Text({ text: "작성한 데이터는 저장되지 않습니다." }),
                    beginButton: new Button({
                        type: ButtonType.Emphasized,
                        text: "네",
                        press: function () {
                            history.back();
                            this.setInit();
                            this.oApproveDialog.destroy();
                            this.oApproveDialog = null; // 반드시 초기화!
                            // this.oApproveDialog.close();
                        }.bind(this)
                    }),
                    endButton: new Button({
                        text: "아니오",
                        press: function () {
                            this.oApproveDialog.destroy();
                            this.oApproveDialog = null; // 반드시 초기화!
                            // this.oApproveDialog.close();
                        }.bind(this)
                    })
                });
            }
            this.oApproveDialog.open();
            // history.back();
            // this.setInit();
        },

        // 저장 버튼
        onSave: function () {
            let ButtonType = Library.ButtonType;
            let DialogType = Library.DialogType;
            if (!this.oApproveDialog) {
                this.oApproveDialog = new Dialog({
                    type: DialogType.Message,
                    title: "저장 확인",
                    content: new Text({ text: "저장하시겠습니까?" }),
                    beginButton: new Button({
                        type: ButtonType.Emphasized,
                        text: "네",
                        press: function () {
                            this._saveLogic();
                            this.oApproveDialog.destroy();
                            this.oApproveDialog = null; // 반드시 초기화!
                        }.bind(this)
                    }),
                    endButton: new Button({
                        text: "아니오",
                        press: function () {
                            this.oApproveDialog.destroy();
                            this.oApproveDialog = null; // 반드시 초기화!
                        }.bind(this)
                    })
                });
            }
            this.oApproveDialog.open();
        },

        updateEntity(oModel, sPath, oData) {
            return new Promise((resolve, reject) => {
                oModel.update(sPath, oData, {
                    method: "PATCH",
                    success: resolve,
                    error: reject
                });
            });
        },

        createEntity(oModel, sPath, oData) {
            return new Promise((resolve, reject) => {
                oModel.create(sPath, oData, {
                    method: "POST",
                    success: resolve,
                    error: reject
                });
            });
        },

        _saveLogic: function () {
            let oModelPartner = this.getView().getModel("CreateBPModel");
            let oModelCustomer = this.getView().getModel("CreateCustomerModel");
            let oModelCredit = this.getView().getModel("CreateCreditModel");
            let oModelVendor = this.getView().getModel("CreateVendorModel");
            let oModelAccount = this.getView().getModel("CreateAccountModel");
            let oModelMatnr = this.getView().getModel("CreateMatnrModel");
            let oModelCusMatnr = this.getView().getModel("CreateCusMatnrModel");
            let oModel = this.getView().getModel();
            let creditLimit;
            let nameCustomer, nameVendor;
            let telC, telV;
            let addC, addV;
            let emailC;
            let aAccountList = oModelAccount.getProperty("/accountList");
            let aMatnrList = oModelMatnr.getProperty("/matnrList");
            let aCusMatList = oModelCusMatnr.getProperty("/matnrList");
            let aCleanedAccountList, aCleanedMatnrList, aCleanedCustMatnrList;
            const baseModel = this.getView().getModel("PartnerSet");
            const sPartnerId = baseModel.getProperty("/Partner");

            // 유효성 테스트
            const sEmailValue = oModelPartner.getProperty("/Email");
            const oNameInput = this.getView().byId("nameTextEdit");
            const oAddressInput = this.getView().byId("addressTextEdit");
            const oPhoneInput = this.getView().byId("phoneInputEdit");
            const oEmailInput = this.getView().byId("emailInputEdit");
            const bValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sEmailValue);
            let aPromises = [];

            // 1. 이름
            if (!oModelPartner.getProperty("/Name1")) {
                oNameInput.setValueState("Error");
                oNameInput.setValueStateText("이름을 입력해주세요.");
            } else {
                oEmailInput.setValueState("None");
            }

            // 2. 주소
            if (!oModelPartner.getProperty("/Stras")) {
                oAddressInput.setValueState("Error");
                oAddressInput.setValueStateText("주소를를 입력해주세요.");
            } else {
                oAddressInput.setValueState("None");
            }

            // 3.전화번호
            if (!oModelPartner.getProperty("/Telf1")) {
                oPhoneInput.setValueState("Error");
                oPhoneInput.setValueStateText("전화번호를를 입력해주세요.");
            } else {
                oPhoneInput.setValueState("None");
            }

            // 4. 메일
            if (!bValid) {
                if (!bValid) {
                    oEmailInput.setValueState("Error");
                    oEmailInput.setValueStateText("올바른 이메일 형식을 입력해주세요.");
                } else {
                    oEmailInput.setValueState("None");
                }
                return; // 저장 중단
            } else {
                oEmailInput.setValueState("None");
            }

            if (!oModelPartner.getProperty("/ShowCustomer")) {
                oModelCustomer.setData({});
                oModelCredit.setData({});
            } else {
                // 5. 고객 이라면 여신 한도도
                const oCreditLimitInput = this.getView().byId("creditLimitInputEdit");
                if (oModelCustomer.getProperty("/CreditLimit")) {
                    oCreditLimitInput.setValueState("Error");
                    oCreditLimitInput.setValueStateText("여신한도를 입력해주세요.");
                    return;
                } else {
                    oCreditLimitInput.setValueState("None");
                }
                nameCustomer = oModelPartner.getProperty("/Name1");
                telC = oModelPartner.getProperty("/Telf1").replace(/\D/g, "");
                addC = oModelPartner.getProperty("/Stras") + " " + oModelPartner.getProperty("/Detail");
                emailC = oModelPartner.getProperty("/Email");
                creditLimit = Number(oModelCredit.getProperty("/CreditLimit").replace(/,/g, "")).toString();

                // 6. 거래 상품
                if (!aCusMatList.length) {
                    MessageToast.show("최소 한 개 이상의 상품을 입력해 주세요.");
                    return;
                }
                aCleanedCustMatnrList = aCusMatList
                    .filter(item => item.IsInit === true) // IsInit이 true인 항목만 필터
                    .map(({ Matnr, Stprs, Waers, Contype }) => ({
                        Matnr,
                        Stprs,
                        Waers,
                        Contype,
                        Partner: sPartnerId
                    }))
                    .filter((item, index, self) =>
                        index === self.findIndex(
                            t =>
                                t.Matnr === item.Matnr &&
                                t.Stprs === item.Stprs &&
                                t.Waers === item.Waers &&
                                t.Contype === item.Contype &&
                                t.Partner === item.Partner
                        )
                    );
            }

            if (!oModelPartner.getProperty("/ShowVendor")) {
                oModelVendor.setData({});
            } else {
                // 7. 거래처라면 거래 계좌, 거래 자재 세팅
                if (!aAccountList.length) {
                    MessageToast.show("최소 한 개 이상의 계좌를 입력해 주세요.");
                    return;
                }
                if (!aMatnrList.length) {
                    MessageToast.show("최소 한 개 이상의 자재를 입력해 주세요.");
                    return;
                }

                nameVendor = oModelPartner.getProperty("/Name1");
                telV = oModelPartner.getProperty("/Telf1").replace(/\D/g, "");
                addV = oModelPartner.getProperty("/Stras") + " " + oModelPartner.getProperty("/Detail");

                // Index 필드를 제거한 새 배열 만들기
                aCleanedAccountList = aAccountList
                    .filter(item => item.IsInit === true) // IsInit이 true인 것만 필터링
                    .map(({ Index, IsInit, ...rest }) => ({ ...rest, Partner: sPartnerId })) // Index, IsInit 제거 + Partner 필드 추가
                    .filter((item, index, self) =>
                        index === self.findIndex(
                            t => JSON.stringify(t) === JSON.stringify(item)
                        )
                    );

                aCleanedMatnrList = aMatnrList
                    .filter(item => item.IsInit === true)
                    .map(item => ({
                        Matnr: item.Matnr,
                        Stprs: item.Stprs,
                        Waers: item.Waers,
                        Contype: item.Contype,
                        Partner: sPartnerId
                    }))
                    .filter((item, _, self) =>
                        self.findIndex(t =>
                            t.Matnr === item.Matnr &&
                            t.Stprs === item.Stprs &&
                            t.Waers === item.Waers &&
                            t.Contype === item.Contype
                        ) === self.indexOf(item)
                    );
            }

            // 1. BP 업데이트
            let oUpdatePartner = {
                Name1: oModelPartner.getProperty("/Name1"),
                // Stras: oModelSave.getProperty("/Stras") + " " + oModelSave.getProperty("/Detail"),
                Land1: oModelPartner.getProperty("/Land1"),
                // Telf1: oModelSave.getProperty("/Telf1"),
                Email: oModelPartner.getProperty("/Email"),
                BpGroup: oModelPartner.getProperty("/BpGroup"),
                BpRole: oModelPartner.getProperty("/BpRole"),
                BpType: oModelPartner.getProperty("/BpType"),
                // ✅ 이미지 필드들
                ImageUrl: oModelPartner.getProperty("/ImageUrl"),
                Mimetype: oModelPartner.getProperty("/Mimetype"),
                ImageData: oModelPartner.getProperty("/ImageData"), // Base64 또는 Binary로 준비됨
                BpGroup: oModelPartner.getProperty("/BpGroup"),
            }
            // BP
            aPromises.push(this.updateEntity(oModel, `/BpSet(Partner='${sPartnerId}')`, oUpdatePartner));

            // 2. Customer 업데이트
            // 고객-여신 업데이트
            let oUpdateCredit = {
                CreditLimit: creditLimit,
                Waers: oModelCustomer.getProperty("/Waers")
            }

            let oUpdateCustomer = {
                Name1: nameCustomer,
                Telf1: telC,
                Email: emailC,
                Stras: addC,
                Knkli: oModelCustomer.getProperty("/Knkli"),
                Ctlzl: oModelCustomer.getProperty("/Ctlzl"),
                Waers: oModelCustomer.getProperty("/Waers")
            }
            // Customer & Credit
            if (oModelPartner.getProperty("/ShowCustomer")) {
                if (baseModel.getProperty("/to_Customer").results?.length > 0) {
                    aPromises.push(this.updateEntity(oModel, `/CusSet('${baseModel.getProperty("/to_Customer/results/0/Cusno")}')`, oUpdateCustomer));
                    aPromises.push(this.updateEntity(oModel, `/CreditSet('${sPartnerId}')`, oUpdateCredit));
                } else {
                    aPromises.push(this.createEntity(oModel, `/BpSet('${sPartnerId}')/to_Customer`, { ...oUpdateCustomer, Partner: sPartnerId }));
                    aPromises.push(this.createEntity(oModel, `/BpSet('${sPartnerId}')/to_Credit`, oUpdateCredit));
                }
            }

            // 3. Vendor 업데이트
            let oUpdateVendor = {
                Name1: nameVendor,
                Telf1: telV,
                Stras: addV,
                Knkli: oModelVendor.getProperty("/Knkli")
            };
            // Vendor
            if (oModelPartner.getProperty("/ShowVendor")) {
                if (baseModel.getProperty("/to_Vendor/results")?.length > 0) {
                    aPromises.push(this.updateEntity(oModel, `/VenSet('${baseModel.getProperty("/to_Vendor/results/0/Venno")}')`, oUpdateVendor));
                } else {
                    aPromises.push(this.createEntity(oModel, `/BpSet(Partner='${sPartnerId}')/to_Vendor`, { ...oUpdateVendor, Partner: sPartnerId }));
                }
            }

            // 4. 거래처-자재 업데이트
            if (Array.isArray(aCleanedMatnrList) && aCleanedMatnrList.length > 0) {
                // 거래처-자재
                aCleanedMatnrList?.forEach(item => {
                    aPromises.push(this.createEntity(oModel, `/BpSet(Partner='${sPartnerId}')/to_Matnr`, item));
                });
            }
            // 5. 거래처-계좌 업데이트
            if (Array.isArray(aCleanedAccountList) && aCleanedAccountList.length > 0) {
                // 거래처-계좌
                aCleanedAccountList?.forEach(item => {
                    aPromises.push(this.createEntity(oModel, `/BpSet(Partner='${sPartnerId}')/to_Bank`, item));
                });
            }


            // 7. 고객-상품 업데이트
            if (Array.isArray(aCleanedCustMatnrList) && aCleanedCustMatnrList.length > 0) {
                // 고객-상품
                aCleanedCustMatnrList?.forEach(item => {
                    aPromises.push(this.createEntity(oModel, `/BpSet(Partner='${sPartnerId}')/to_CusMatnr`, item));
                });
            }

            Promise.all(aPromises)
                .then(() => {
                    MessageToast.show("모든 저장이 완료되었습니다.");
                    history.back();
                    this.setInit();
                })
                .catch((oError) => {
                    console.error("저장 실패", oError);
                    MessageToast.show("일부 저장에 실패했습니다. 다시 시도해 주세요.");
                });
        },

        onEmailChange: function (oEvent) {
            const sValue = oEvent.getParameter("value");
            const oInput = oEvent.getSource();
            const bValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sValue);

            if (!bValid) {
                oInput.setValueState("Error");
                oInput.setValueStateText("올바른 이메일 형식이 아닙니다.");
            } else {
                oInput.setValueState("None");
            }
        },

        onNameChange: function (oEvent) {
            const sValue = oEvent.getParameter("value");
            const oInput = oEvent.getSource();
            if (sValue) {
                oInput.setValueState("None");
            }
        },

        onAddressChange: function (oEvent) {
            const sValue = oEvent.getParameter("value");
            const oInput = oEvent.getSource();
            if (sValue) {
                oInput.setValueState("None");
            }
        },

        onPhoneChange: function (oEvent) {
            const oInput = oEvent.getSource();
            let sValue = oEvent.getParameter("value");

            // 숫자와 '-'만 허용
            sValue = sValue.replace(/[^\d-]/g, "");

            // 상태 초기화
            if (sValue) {
                oInput.setValueState("None");
            }

            // 정제된 값 필드에 다시 설정
            oInput.setValue(sValue);

            // 모델에도 업데이트 (필요시)
            this.getView().getModel("CreateBPModel").setProperty("/Telf1", sValue);
        },
    });
});