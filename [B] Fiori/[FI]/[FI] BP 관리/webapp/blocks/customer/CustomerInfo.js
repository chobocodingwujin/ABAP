sap.ui.define([
  "sap/ui/core/library",
  "sap/uxap/BlockBase"
], function (coreLibrary, BlockBase) {
  "use strict";

  var ViewType = coreLibrary.mvc.ViewType;

  return BlockBase.extend("blocks.customer.CustomerInfo", {
    metadata: {
      views: {
        Collapsed: {
          viewName: "blocks.customer.CustomerInfo",  // 실제 view 파일 위치
          type: ViewType.XML
        },
        Expanded: {
          viewName: "blocks.customer.CustomerInfo",  // 동일 View 재사용 가능
          type: ViewType.XML
        }
      }
    }
  });
});
