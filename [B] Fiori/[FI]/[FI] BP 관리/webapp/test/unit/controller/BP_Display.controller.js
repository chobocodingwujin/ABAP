/*global QUnit*/

sap.ui.define([
	"bp_control/bp_control/controller/BP_Display.controller"
], function (Controller) {
	"use strict";

	QUnit.module("BP_Display Controller");

	QUnit.test("I should test the BP_Display controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
