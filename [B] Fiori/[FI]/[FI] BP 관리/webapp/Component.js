sap.ui.define([
    "sap/ui/core/UIComponent",
    "bpcontrol/bpcontrol/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("bpcontrol.bpcontrol.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();
        },
        
        destroy() {
            try {
                // 정리 필요 시 여기에 추가
                // 예: 이벤트 detach, 커스텀 컨트롤 destroy 등

                UIComponent.prototype.destroy.apply(this, arguments);
            } catch (e) {
                console.warn("Component destroy 예외 발생:", e);
            }
        }
    });
});