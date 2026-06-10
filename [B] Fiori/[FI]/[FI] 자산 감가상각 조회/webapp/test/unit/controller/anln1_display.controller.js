/*global QUnit*/

sap.ui.define([
	"anln1_display/anln1_display/controller/anln1_display.controller"
], function (Controller) {
	"use strict";

	QUnit.module("anln1_display Controller");

	QUnit.test("I should test the anln1_display controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
