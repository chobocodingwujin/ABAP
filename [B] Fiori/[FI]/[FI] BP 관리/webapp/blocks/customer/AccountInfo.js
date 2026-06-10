sap.ui.define([
  "sap/ui/core/library",
  "sap/uxap/BlockBase"
], function (coreLibrary, BlockBase) {
  "use strict";

  var ViewType = coreLibrary.mvc.ViewType;

  return BlockBase.extend("blocks.customer.AccountInfo", {
    metadata: {
      views: {
        Collapsed: {
          viewName: "blocks.customer.AccountInfo",  // 실제 view 파일 위치
          type: ViewType.XML
        },
        Expanded: {
          viewName: "blocks.customer.AccountInfo",  // 동일 View 재사용 가능
          type: ViewType.XML
        }
      }
    }
  });
});
