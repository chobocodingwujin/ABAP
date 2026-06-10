sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("anln1display.anln1display.controller.anln1_display", {
        onInit() {
        },

        onAfterRendering() {
            const oSmartFilterBar = this.byId("smartFilterBar");

            if (oSmartFilterBar && !oSmartFilterBar.getLiveMode()) {
                // BUKRS 값을 '1000'으로 강제 세팅
                // oSmartFilterBar.setFilterData({
                //     Bukrs: "1000"
                // });

                // 필터 세팅 이후 검색 실행
                oSmartFilterBar.search();
            }
        },

        onRowPress: function (oEvent) {
            const oItem = oEvent.getSource(); // 이게 ColumnListItem
            const oContext = oItem.getBindingContext();
            if (!oContext) {
                console.error("Binding context is missing.");
                return;
            }

            const oData = oContext.getObject();
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("Routeanln1_detail", { anln1: oData.Anln1 });
        },
    });
});