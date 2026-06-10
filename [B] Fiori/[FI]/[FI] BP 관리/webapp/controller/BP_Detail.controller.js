sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    'sap/ui/model/odata/v2/ODataModel',
    "sap/ui/model/json/JSONModel"
], (Controller, MessageToast, ODataModel, JSONModel) => {
    "use strict";

    return Controller.extend("bpcontrol.bpcontrol.controller.BP_Detail", {
        onInit() {
            //날짜 세팅
            let oNow = new Date();
            let sTime = oNow.toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit"
            });
            let sDay = oNow.toLocaleDateString("ko-KR", { weekday: "long" }); // ex. 월요일

            let sFinalText = `${sTime}, ${sDay}`; // ex. 03:45, 화요일
            this.byId("currentTimeLabel").setText(sFinalText);
            let oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteBP_Detail").attachPatternMatched(this._onObjectMatched, this);
            this.getView().addEventDelegate({

                onBeforeShow: function (oEvent) {
                    // 여기에 필요한 갱신 로직
                    let sPartnerId = sessionStorage.getItem("partnerId");
                    if (sPartnerId && this.getView().getModel("PartnerSet")) {
                        console.log(sPartnerId);
                        this._onInitData(sPartnerId);
                    }
                }.bind(this)
            });
        },

        _onObjectMatched: function (oEvent) {
            let sPartnerId = oEvent.getParameter("arguments").partnerId;
            sessionStorage.setItem("partnerId", sPartnerId);
            this._onInitData(sPartnerId);
        },

        _onInitData: function (sPartnerId) {
            let oComponent = this.getOwnerComponent();
            let oODataModel = oComponent.getModel(); // ODataModel
            let oView = this.getView();
            let sBasePath = `/BpSet('${sPartnerId}')`;

            oODataModel.read(sBasePath, {
                urlParameters: {
                    "$expand": "to_Bank,to_Credit,to_Customer,to_Vendor,to_CusTotal,to_Matnr,to_Trade,to_CusMatnr"
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

                    // 2. Phone 가공
                    let sCustomerPhone = oData.to_Customer.results[0]?.Telf1;
                    let sVendorPhone = oData.to_Vendor.results[0]?.Telf1;
                    let phone = sCustomerPhone || sVendorPhone || "주소 없음";
                    // oData.Phone = sCustomerPhone || sVendorPhone || "주소 없음";
                    if (phone && phone.startsWith("0")) {
                        phone = phone.substring(1); // 앞자리 0 제거
                    }

                    oData.Phone = phone
                        ? `+${oData.Intca}${phone}`
                        : "연락처 없음";

                    // 3. Email 가공
                    let sCustomerEmail = oData.to_Customer.results[0]?.Email;
                    let sVendorEmail = oData.to_Vendor.results[0]?.Email;
                    // oData.Email = sCustomerEmail || sVendorEmail || "주소 없음";


                    // 4. 국가, 도시 세팅
                    let city = oData.Address.split(" ").slice(0, 1).join(" ");
                    let addr = city + ", " + oData.Landx;
                    this.getView().byId("address").setText(addr);

                    // 9. 지도 세팅
                    let sMapUrl = `https://www.google.com/maps?q=${encodeURIComponent(oData.Address)}&output=embed`;
                    let sIframe = `<iframe width="500" height="300" style="border:0" src="${sMapUrl}"></iframe>`;
                    this.byId("mapContainer").setContent(sIframe);

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

                    // 11. 고객 거래내역 차트 데이터 세팅
                    // 현재 연도
                    let currentYear = new Date().getFullYear().toString(); // 예: "2025"
                    let merged = this.buildMergedMonthlyData(oData, currentYear);
                    let chartModel = new sap.ui.model.json.JSONModel({ to_CusTotalMerged: merged });
                    this.getView().setModel(chartModel, "ChartModel");
                    this.setChartData(currentYear);

                    //12. 거래처 거래내역 차트 데이터 세팅(월 별 자재 구매량 비교)
                    let mergedTrade = this.buildMergedMonthlyDataTrade(oData, currentYear);
                    let chartModelTrade = new sap.ui.model.json.JSONModel({ to_TradeMerged: mergedTrade });
                    this.getView().setModel(chartModelTrade, "ChartModelTrade");
                    this.setChartDataTrade(currentYear);

                    // 모델 바인딩
                    let oFinalModel = new sap.ui.model.json.JSONModel(oData);

                    oView.setModel(oFinalModel, "PartnerSet");

                    console.log("✅ 파트너 전체 데이터:", oFinalModel.getData());

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

                    // 요일: ex. 일요일
                    let sDay = oNow.toLocaleDateString("ko-KR", { weekday: "long" });

                    // 최종 텍스트
                    let sFinalText = `${sDate} (${sDay}) ${sTime}`; // 예: 2025-05-18 (일요일) 15:22
                    let oBlock = this.byId("credit");
                    let aViews = oBlock.getAggregation("_views");
                    if (aViews) {
                        let oInnerView = aViews[0];
                        oInnerView.byId("lasted_update").setText(sFinalText);
                        console.log('oInnerView.byId("lasted_update").getText()');
                    }

                    // Default 조회(GO 없이) 세팅
                    let oSmartFilterBar = this.byId("smartFilterBar_acc");
                    let oSmartTable = this.byId("accTable");

                    if (oSmartFilterBar) {
                        oSmartFilterBar.setFilterData({ Partner: sPartnerId });
                        oSmartFilterBar.search();
                        // SmartTable 수동 리바인딩 (이건 보통 필요 없지만, 안전하게 추가)
                        oSmartTable.rebindTable(true);
                    } else {
                        console.error("❌ SmartFilterBar를 여전히 찾을 수 없습니다.");
                    }

                    // Default 조회(GO 없이) 세팅
                    let oSmartFilterBar2 = this.byId("smartFilterBar_matnr");
                    let oSmartTable2 = this.byId("matnrTable");

                    if (oSmartFilterBar2) {
                        oSmartFilterBar2.setFilterData({ Partner: sPartnerId });
                        oSmartFilterBar2.search();
                        // SmartTable 수동 리바인딩 (이건 보통 필요 없지만, 안전하게 추가)
                        oSmartTable2.rebindTable(true);
                    } else {
                        console.error("❌ SmartFilterBar를 여전히 찾을 수 없습니다.");
                    }


                    // Default 조회(GO 없이) 세팅
                    let oSmartFilterBar3 = this.byId("smartFilterBar_cusmatnr");
                    let oSmartTable3 = this.byId("cusmatnrTable");

                    if (oSmartFilterBar3) {
                        oSmartFilterBar3.setFilterData({ Partner: sPartnerId });
                        oSmartFilterBar3.search();
                        // SmartTable 수동 리바인딩 (이건 보통 필요 없지만, 안전하게 추가)
                        oSmartTable3.rebindTable(true);
                    } else {
                        console.error("❌ SmartFilterBar를 여전히 찾을 수 없습니다.");
                    }

                },
                error: (err) => {
                    console.error("❌ Partner 조회 실패:", err);
                }
            });
        },

        onBack() {
            let oRouter = this.getOwnerComponent().getRouter();
            // oRouter.navTo("RouteBP_Display", true);
            history.back(); // 또는 window.history.back();
            // this.getView().destroy();
        },

        // 차트 데이터 세팅
        buildMergedMonthlyData: function (oData, selectedYear) {
            let currentYear = String(selectedYear);
            let previousYear = String(selectedYear - 1);

            // 1월 ~ 12월 기본 템플릿
            const allMonths = Array.from({ length: 12 }, (_, i) => ({
                Monat: String(i + 1),
                Wrbtr_C: 0,
                Wrbtr_P: 0,
                Gjahr_C: currentYear,
                Gjahr_P: previousYear
            }));

            const actualData = oData.to_CusTotal?.results || [];
            const merged = allMonths.map(month => {
                const monthVal = month.Monat;

                const foundCurrent = actualData.find(d => d.Gjahr === currentYear && d.Monat === monthVal);
                const foundPrevious = actualData.find(d => d.Gjahr === previousYear && d.Monat === monthVal);

                return {
                    Monat: monthVal,
                    Gjahr_C: currentYear,
                    Wrbtr_C: foundCurrent ? parseFloat(foundCurrent.Wrbtr) : 0,
                    Gjahr_P: previousYear,
                    Wrbtr_P: foundPrevious ? parseFloat(foundPrevious.Wrbtr) : 0
                };
            });
            console.log(actualData);
            return merged;
        },

        buildMergedMonthlyDataTrade: function (oData, selectedYear, selectedMatnr) {
            const actualData = oData.to_Trade?.results || [];
            const monthList = Array.from({ length: 12 }, (_, i) => String(i + 1));
            let matnrList = [];
            if (selectedMatnr === undefined) {
                matnrList = [...new Set(actualData.map(d => d.Matnr))];
            } else {
                matnrList.push(selectedMatnr);
            }
            console.log(matnrList);
            const merged = [];

            monthList.forEach(month => {
                const row = { Monat: `${parseInt(month)}월` };

                matnrList.forEach(matnr => {
                    const entry = actualData.find(d =>
                        d.TYear === String(selectedYear) &&
                        d.Monat === month &&
                        d.Matnr === matnr
                    );

                    row[matnr] = entry ? parseFloat(entry.Menge) : 0;
                });

                merged.push(row);
            });
            console.log("Trade", merged);
            return merged;
        },


        // 차트 UI 세팅
        setChartData(selectedYear) {
            let previousYear = String(selectedYear - 1);
            // 차트 화면 세팅
            let oDataset = new sap.viz.ui5.data.FlattenedDataset({
                dimensions: [{
                    name: "월",
                    value: "{Monat}"
                }],
                measures: [
                    {
                        name: `${selectedYear}년 금액`,
                        value: "{Wrbtr_C}"
                    },
                    {
                        name: `${previousYear}년 금액`,
                        value: "{Wrbtr_P}"
                    }
                ],
                data: {
                    path: "ChartModel>/to_CusTotalMerged"
                }
            });

            let oVizFrame = this.byId("idLineFrame");
            let oPopover = this.byId("idPopOver");
            // Popover를 VizFrame에 연결
            oPopover.connect(oVizFrame.getVizUid());
            oVizFrame.setDataset(oDataset);
            // oVizFrame.setModel(this.getView().getModel("PartnerSet"), "ChartModel");

            oVizFrame.removeAllFeeds();

            oVizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                uid: "valueAxis",
                type: "Measure",
                values: [`${selectedYear}년 금액`, `${previousYear}년 금액`]
            }));

            oVizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                uid: "categoryAxis",
                type: "Dimension",
                values: ["월"]
            }));
        },

        setChartDataTrade(selectedYear) {
            let actualData = this.getView().getModel("ChartModelTrade").getProperty("/to_TradeMerged") || [];

            // 차트용 더미 데이터와 더미 측정값 설정
            if (actualData.length === 0) {
                actualData = [{ Monat: "1", Dummy: 0 }];
                this.getView().getModel("ChartModelTrade").setProperty("/to_TradeMerged", actualData);
            }

            const matnrList = Object.keys(actualData[0]).filter(key => key !== "Monat");
            if (matnrList.length === 0) {
                matnrList.push("Dummy"); // 최소 1개는 있어야 vizFrame이 그려짐
            }

            const oDataset = new sap.viz.ui5.data.FlattenedDataset({
                dimensions: [{
                    name: "월",
                    value: "{Monat}"
                }],
                measures: matnrList.map(matnr => ({
                    name: matnr,
                    value: `{${matnr}}`
                })),
                data: {
                    path: "ChartModelTrade>/to_TradeMerged"
                }
            });

            const oVizFrame = this.byId("idLineFrame2");
            const oPopover = this.byId("idPopOver2");

            oPopover.connect(oVizFrame.getVizUid());
            oVizFrame.setDataset(oDataset);
            oVizFrame.removeAllFeeds();

            // valueAxis - 최소 1개 이상 필수
            oVizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                uid: "valueAxis",
                type: "Measure",
                values: matnrList
            }));

            // categoryAxis - x축
            oVizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                uid: "categoryAxis",
                type: "Dimension",
                values: ["월"]
            }));
        },

        // 년도 Search Help
        onYearHelpPress: function (oEvent) {
            const aYears = ["2023", "2024", "2025"];
            const oInput = oEvent.getSource();

            if (!this._oYearDialog) {
                this._oYearDialog = new sap.m.SelectDialog({
                    title: "연도 선택",
                    items: aYears.map(y => new sap.m.StandardListItem({ title: y })),
                    confirm: function (oEvent) {
                        const selected = oEvent.getParameter("selectedItem").getTitle();
                        oInput.setValue(selected);
                    }
                });
            }

            this._oYearDialog.open();
        },

        // 자재코드 Search Help
        onMatnrHelpPress: function (oEvent) {
            const oInput = oEvent.getSource();

            const actualData = this.getView().getModel("ChartModelTrade").getProperty("/to_TradeMerged");
            // 자재코드 목록 추출
            const matnrList = Object.keys(actualData[0]).filter(key => key !== "Monat");

            if (!this._oMatnrDialog) {
                this._oMatnrDialog = new sap.m.SelectDialog({
                    title: "자재코드 선택",
                    items: matnrList.map(code => new sap.m.StandardListItem({
                        title: code
                    })),
                    confirm: function (oEvent) {
                        const selected = oEvent.getParameter("selectedItem").getTitle();
                        oInput.setValue(selected); // 선택된 자재코드를 Input에 세팅
                    },
                    search: function (oEvent) {
                        const sValue = oEvent.getParameter("value");
                        const oFilter = new sap.ui.model.Filter("title", sap.ui.model.FilterOperator.Contains, sValue);
                        oEvent.getSource().getBinding("items").filter([oFilter]);
                    }
                });
            }

            this._oMatnrDialog.open();
        },

        // 선택한 자제에 대한 데이터 출력
        onMatnrSubmit: function (oEvent) {
            let selectedMatnr = oEvent.getParameter("value").toString();
            let selectedYear = '2025';
            let oData = this.getView().getModel("PartnerSet").getProperty("/");
            let merged = this.buildMergedMonthlyDataTrade(oData, selectedYear, selectedMatnr);
            let chartModel = new sap.ui.model.json.JSONModel({ to_TradeMerged: merged });

            this.getView().setModel(chartModel, "ChartModelTrade");

            this.setChartDataTrade(selectedYear);
        },

        // 연도 변경
        onYearSubmit: function (oEvent) {
            let selectedYear = oEvent.getParameter("value").toString();
            if (!selectedYear) {
                selectedYear = new Date().getFullYear().toString(); // 예: "2025"
            }
            let oData = this.getView().getModel("PartnerSet").getProperty("/");
            let merged = this.buildMergedMonthlyData(oData, selectedYear);

            let chartModel = new sap.ui.model.json.JSONModel({ to_CusTotalMerged: merged });
            this.getView().setModel(chartModel, "ChartModel");

            this.setChartData(selectedYear);
        },

        // 연도 변경
        onYearSubmit2: function (oEvent) {
            let selectedYear = oEvent.getParameter("value").toString();
            if (!selectedYear) {
                selectedYear = new Date().getFullYear().toString(); // 예: "2025"
            }
            let oData = this.getView().getModel("PartnerSet").getProperty("/");
            let merged = this.buildMergedMonthlyDataTrade(oData, selectedYear);

            let chartModel = new sap.ui.model.json.JSONModel({ to_TradeMerged: merged });
            this.getView().setModel(chartModel, "ChartModelTrade");

            this.setChartDataTrade(selectedYear);
        },

        // 차트 모드 변경
        onChartTypeChange: function (oEvent) {
            const sSelectedType = oEvent.getSource().getSelectedKey(); // "column" or "line"
            const oVizFrame = this.byId("idLineFrame");

            oVizFrame.setVizType(sSelectedType);
        },

        // 차트 모드 변경
        onChartTypeChange2: function (oEvent) {
            const sSelectedType = oEvent.getSource().getSelectedKey(); // "column" or "line"
            const oVizFrame = this.byId("idLineFrame2");

            oVizFrame.setVizType(sSelectedType);
        },

        // 테이블 로우 클릭
        onRowPress: function (oEvent) {
            const oItem = oEvent.getSource(); // 이게 ColumnListItem
            // let oTable = this.getView().byId("matnrTable").getTable(),
            //     aItems = oTable.getSelectedItems();
            if (oItem) {

                // 선택한 행 꺼내기
                const oContext = oItem.getBindingContext();
                let oData = oContext.getObject();
                let selectedMatnr = oData.Matnr;
                let selectedYear = this.byId("yearInput2").getValue() !== '' ? this.byId("yearInput2").getValue() : '2025'; // 🔍 여기!
                console.log(selectedYear, selectedMatnr);
                let oDataModel = this.getView().getModel("PartnerSet").getProperty("/");
                let merged = this.buildMergedMonthlyDataTrade(oDataModel, selectedYear, selectedMatnr);
                let chartModel = new sap.ui.model.json.JSONModel({ to_TradeMerged: merged });

                this.getView().setModel(chartModel, "ChartModelTrade");

                this.setChartDataTrade(selectedYear);
            }
        },

        // 수정 페이지 이동
        onEdit: function () {
            let oRouter = this.getOwnerComponent().getRouter();
            let oData = this.getView().getModel("PartnerSet").getProperty("/");
            oRouter.navTo("RouteBP_Edit", { partnerId: oData.Partner });
        }
    });
});