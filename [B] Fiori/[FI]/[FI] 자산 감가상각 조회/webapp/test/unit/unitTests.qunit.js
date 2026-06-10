/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"anln1_display/anln1_display/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
