sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    'sap/ui/model/odata/v2/ODataModel'
], (Controller, MessageToast, ODataModel) => {
    "use strict";

    return Controller.extend("bpcontrol.bpcontrol.controller.BP_Display", {
        onInit() {
            console.log("display screen_v11");
        },

        onBeforeExport: function (oEvt) {
            var mExcelSettings = oEvt.getParameter("exportSettings");

            // Disable Worker as Mockserver is used in Demokit sample
            mExcelSettings.worker = false;
        },

        onAfterRendering: function () {
            const oSmartFilterBar = this.byId("smartFilterBar");

            if (oSmartFilterBar && !oSmartFilterBar.getLiveMode()) {
                oSmartFilterBar.search();

                const oSmartTable = this.byId("bpTable");
                console.log("test");
                // 내부 테이블이 완전히 초기화되었을 때만 접근
                setTimeout(() => {
                    const oTable = oSmartTable.getTable();
                    const oModel = oTable.getModel();
                    console.log("모델: ", oModel);
                }, 0);
            }
        },

        // onCellClick: function (oEvent) {
        //     console.log('test');
        //     const iRowIndex = oEvent.getParameter("rowIndex");
        //     if (iRowIndex < 0) return;

        //     const oTable = oEvent.getSource();
        //     const oContext = oTable.getContextByIndex(iRowIndex);
        //     const sPartner = oContext.getProperty("Partner");

        //     // 상세 페이지 라우팅
        //     this.getOwnerComponent().getRouter().navTo("bpDetail", {
        //         partnerId: sPartner
        //     });
        // },

        onRowPress: function (oEvent) {
            const oItem = oEvent.getSource(); // 이게 ColumnListItem
            const oContext = oItem.getBindingContext();

            if (!oContext) {
                console.error("Binding context is missing.");
                return;
            }

            const oData = oContext.getObject();
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteBP_Detail", { partnerId: oData.Partner });
        },

        onCreate: function () {
            let oRouter = this.getOwnerComponent().getRouter();

            oRouter.navTo("RouteBP_Create");
        },

        onExit: function () {
            // 모델 정리 등 필요 시 수행
            // this.getView().destroy();  // 또는 this.getOwnerComponent().destroy();
        }
    });
});

