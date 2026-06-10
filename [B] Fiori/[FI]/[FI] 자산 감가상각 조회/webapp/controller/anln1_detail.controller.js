sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("anln1display.anln1display.controller.anln1_detail", {
        onInit() {

            let oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("Routeanln1_detail").attachPatternMatched(this._onObjectMatched, this);

            this.getView().addEventDelegate({

                onBeforeShow: function (oEvent) {
                    // 여기에 필요한 갱신 로직
                    let sAnln1 = sessionStorage.getItem("anln1");
                    if (sAnln1 && this.getView().getModel("oModel")) {
                        console.log(sAnln1);
                        this._onInitData(sAnln1);
                    }
                }.bind(this)
            });
        },

        _onObjectMatched: function (oEvent) {
            let sAnln1 = oEvent.getParameter("arguments").anln1;
            sessionStorage.setItem("anln1", sAnln1);
            this._onInitData(sAnln1);
        },

        _onInitData: function (sAnln1) {
            let oComponent = this.getOwnerComponent();
            let oODataModel = oComponent.getModel(); // ODataModel
            let oView = this.getView();
            let sBasePath = `/Anln1Set(Bukrs='1000',Anln1='${sAnln1}')`;
            let oLogModel;
            oODataModel.read(sBasePath, {
                urlParameters: {
                    "$expand": "to_Log"
                },
                success: (oData) => {
                    console.log(oData);
                    // 원하는 곳에 setModel 하려면 아래처럼
                    const oLocalModel = new sap.ui.model.json.JSONModel();
                    const lastItem = oData.to_Log.results[oData.to_Log.results.length - 1];
                    const currency = lastItem.Waers;
                    const oVizFrame = this.byId("idLineFrame");
                    const oPopover = this.byId("idPopOver");
                    const oVizFrame2 = this.byId("idLineFrame2");
                    const oPopover2 = this.byId("idPopOver2");
                    const oVizFrame3 = this.byId("idLineFrame3");
                    const oPopover3 = this.byId("idPopOver3");

                    oPopover.connect(oVizFrame.getVizUid());
                    oPopover2.connect(oVizFrame2.getVizUid());
                    oPopover3.connect(oVizFrame3.getVizUid());
                    oData.view = false;
                    oData.donut = [
                        {
                            Name1: "취득가액",
                            Wrbtr: lastItem.Buypr
                        },
                        {
                            Name1: "장부가액",
                            Wrbtr: lastItem.Bvalu
                        },
                        {
                            Name1: "감가상각누계액",
                            Wrbtr: lastItem.Desum
                        }
                    ]
                    oData.items = [
                        {
                            Name1: "취득가액",
                            Wrbtr: Number(lastItem.Buypr).toLocaleString() + " " + currency,
                            highlight: "Success",
                            type: "Active"
                        },
                        {
                            Name1: "장부가액",
                            Wrbtr: Number(lastItem.Bvalu).toLocaleString() + " " + currency,
                            highlight: "Warning",
                            type: "Active"
                        },
                        {
                            Name1: "감가상각누계액",
                            Wrbtr: Number(lastItem.Desum).toLocaleString() + " " + currency,
                            highlight: "Error",
                            type: "Active"
                        }
                    ];
                    oLocalModel.setData(oData);
                    this.getView().setModel(oLocalModel, "logModel");
                    this._setMonthlyData(1);
                    this._setYearlyData();
                    console.log(oData);
                }
            });
        },

        _setMonthlyData: function (i) {
            let oLocalModel = this.getView().getModel("logModel");
            let oData = oLocalModel.getData();
            const currentYear = new Date().getFullYear(); // 예: 2025
            const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0'); // 예: "06"
            const lastItem = oData.to_Log.results[oData.to_Log.results.length - i]; // 최신년도 기준
            let startWrbtr = lastItem['Bvalu'];
            const monthlyData = [];

            for (let i = 1; i <= 12; i++) {
                const month = i.toString().padStart(2, '0'); // '01' ~ '12'
                if (lastItem['Gjahr'].toString() === currentYear.toString() && month === currentMonth) {
                    break;
                }
                monthlyData.push({
                    Monat: `${i}월`,
                    Remain: Number(startWrbtr - lastItem[`Deppr${month}`] || 0),
                    Wrbtr: Number(lastItem[`Deppr${month}`] || 0)  // 필요하면 toLocaleString() 붙이기
                });
                startWrbtr -= lastItem[`Deppr${month}`] || 0;
            }
            oData.monthlyData = monthlyData;
            oLocalModel.setData(oData);
            this.getView().setModel(oLocalModel, "logModel");
            console.log(oData);
        },

        _setYearlyData: function () {
            let oLocalModel = this.getView().getModel("logModel");
            let oData = oLocalModel.getData();
            const item = oData.to_Log.results;
            const yearlyData = [];

            for (let i = 0; i < item.length; i++) {
                yearlyData.push({
                    Year: item[i]['Gjahr'],
                    Remain: Number(item[i][`Buypr`] || 0),
                    Wrbtr: Number(item[i][`Bvalu`] || 0)  // 필요하면 toLocaleString() 붙이기
                });
            }

            oData.yearlyData = yearlyData;
            oLocalModel.setData(oData);
            this.getView().setModel(oLocalModel, "logModel");
            console.log(oData);
        },

        onViewModeChange: function (oEvent) {
            const sKey = oEvent.getParameter("item").getKey(); // 'hour', 'day', 'week', 'month'
            console.log("선택된 보기 모드:", sKey);
            let oModel = this.getView().getModel("logModel");
            let oData = oModel.getData();
            // 선택된 모드에 따라 차트 데이터 변경
            switch (sKey) {
                case "year":
                    this._loadYearlyData();
                    oData.view = false;
                    break;
                case "month":
                    this._loadMonthlyData();
                    oData.view = true;
                    break;
            }
            oModel.setData(oData);
        },

        _loadYearlyData: function () {
            // 1. 실제 사용할 Measure 이름 정의
            const measureNames = ["취득가액", "장부가액"]; // 해당 이름은 모델에 존재하는 속성 이름과 일치해야 함

            // 2. VizFrame Dataset 구성
            const oDataset = new sap.viz.ui5.data.FlattenedDataset({
                dimensions: [{
                    name: "년",
                    value: "{Year}"
                }],
                measures: measureNames.map(name => ({
                    name: name,
                    value: `{${name === "취득가액" ? "Remain" : "Wrbtr"}}` // 내부 속성명을 매핑
                })),
                data: {
                    path: "logModel>/yearlyData"
                }
            });

            // 3. VizFrame에 적용
            const oVizFrame = this.byId("idLineFrame");
            const oPopover = this.byId("idPopOver");
            oVizFrame.setVizProperties({
                title: {
                    text: "연도별 감가상각비 누계"  // 원하는 제목으로 변경
                }
            });
            oPopover.connect(oVizFrame.getVizUid());
            oVizFrame.setDataset(oDataset);
            oVizFrame.removeAllFeeds();

            // 4. Feed 추가 (Measure와 Dimension 명칭은 Dataset 정의와 동일해야 함)
            oVizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                uid: "valueAxis",
                type: "Measure",
                values: measureNames
            }));

            oVizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                uid: "categoryAxis",
                type: "Dimension",
                values: ["년"]
            }));
        },

        _loadMonthlyData: function () {
            // 1. 실제 사용할 Measure 이름 정의
            const measureNames = ["장부가액", "감가상각비"]; // 해당 이름은 모델에 존재하는 속성 이름과 일치해야 함

            // 2. VizFrame Dataset 구성
            const oDataset = new sap.viz.ui5.data.FlattenedDataset({
                dimensions: [{
                    name: "월",
                    value: "{Monat}"
                }],
                measures: measureNames.map(name => ({
                    name: name,
                    value: `{${name === "장부가액" ? "Remain" : "Wrbtr"}}` // 내부 속성명을 매핑
                })),
                data: {
                    path: "logModel>/monthlyData"
                }
            });

            // 3. VizFrame에 적용
            const oVizFrame = this.byId("idLineFrame");
            const oPopover = this.byId("idPopOver");
            oVizFrame.setVizProperties({
                title: {
                    text: "월별 감가상각비 누계"  // 원하는 제목으로 변경
                }
            });
            oPopover.connect(oVizFrame.getVizUid());
            oVizFrame.setDataset(oDataset);
            oVizFrame.removeAllFeeds();

            // 4. Feed 추가 (Measure와 Dimension 명칭은 Dataset 정의와 동일해야 함)
            oVizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                uid: "valueAxis",
                type: "Measure",
                values: measureNames
            }));

            oVizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                uid: "categoryAxis",
                type: "Dimension",
                values: ["월"]
            }));
        },

        // 차트 모드 변경
        onChartTypeChange: function (oEvent) {
            const oModel = this.getView().getModel("logModel");
            const oData = oModel.getData();
            const sSelectedType = oEvent.getSource().getSelectedKey(); // "column" or "line"
            const oVizFrame = this.byId("idLineFrame");

            // 1. 차트 타입 변경
            oVizFrame.setVizType(sSelectedType);

            // 2. 기존 Feed 제거
            oVizFrame.removeAllFeeds();

            // 3. Feed 다시 추가
            if (oData.view) {
                oVizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                    uid: "valueAxis",
                    type: "Measure",
                    values: ["장부가액", "감가상각비"]
                }));
                oVizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                    uid: "categoryAxis",
                    type: "Dimension",
                    values: ["월"]
                }));
            } else {
                oVizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                    uid: "valueAxis",
                    type: "Measure",
                    values: ["취득가액", "장부가액"]
                }));
                oVizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem({
                    uid: "categoryAxis",
                    type: "Dimension",
                    values: ["년"]
                }));
            }

        },

        // 연도 변경
        onYearSubmit: function (oEvent) {
            const currentYear = new Date().getFullYear(); // 예: 2025
            let selectedYear = oEvent.getParameter("value").toString();
            if (!selectedYear) {
                selectedYear = new Date().getFullYear().toString(); // 예: "2025"
            }
            this._setMonthlyData(currentYear - selectedYear + 1);
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

        onDrop: function (oInfo) {
            var oDragged = oInfo.getParameter("draggedControl"),
                oDropped = oInfo.getParameter("droppedControl"),
                sInsertPosition = oInfo.getParameter("dropPosition"),
                oGrid = oDragged.getParent(),
                oModel = this.getView().getModel("logModel"),
                aItems = oModel.getProperty("/items"),
                iDragPosition = oGrid.indexOfItem(oDragged),
                iDropPosition = oGrid.indexOfItem(oDropped);

            // remove the item
            var oItem = aItems[iDragPosition];
            aItems.splice(iDragPosition, 1);

            if (iDragPosition < iDropPosition) {
                iDropPosition--;
            }

            // insert the control in target aggregation
            if (sInsertPosition === "Before") {
                aItems.splice(iDropPosition, 0, oItem);
            } else {
                aItems.splice(iDropPosition + 1, 0, oItem);
            }

            oModel.setProperty("/items", aItems);
        }
    });
});