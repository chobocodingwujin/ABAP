sap.ui.define([
  "sap/ui/core/library",
  "sap/uxap/BlockBase"
], function (coreLibrary, BlockBase) {
  "use strict";

  var ViewType = coreLibrary.mvc.ViewType;

  return BlockBase.extend("blocks.partner.PartnerInfo", {
    metadata: {
      views: {
        Collapsed: {
          viewName: "blocks.partner.PartnerInfo",  // 실제 view 파일 위치
          type: ViewType.XML
        },
        Expanded: {
          viewName: "blocks.partner.PartnerInfo",  // 동일 View 재사용 가능
          type: ViewType.XML
        }
      }
    }
  });
});
