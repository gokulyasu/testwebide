sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ushell/services/CrossApplicationNavigation"
], function(Controller, CrossApplicationNavigation) {
	"use strict";

	return Controller.extend("com.maventic.asset.Home.controller.testFiori", {

		onAfterRendering: function() {
			this.oRouter = this.getOwnerComponent().getRouter();
		},

		navHome: function() {
			// this.oRouter.navTo("mvn_asset_action_item");
		},
		navAction: function() {
			this.oRouter.navTo("mvn_asset_action_item");
		},

		navCommonDashboard: function() {
			this.oRouter.navTo("mvn_asset_co_db");
		},

		navPi: function() {
			this.oRouter.navTo("mvn_pire");
		},

		navInward: function() {
			var oRouter = this.getOwnerComponent().getRouter();

			oRouter.navTo("mvn_asset_inwarding_inwardAsset_detail");
		},

		navTransSearch: function() {
			// this.oRouter.navTo("mvn_asset_TranAcs_Search");
			var pattern = "mvn/asset/inwarding/inwardofasset";
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			oCrossAppNavigator.isIntentSupported(["ZEAM_MVN_SEM_OBJ-display"])
				.done(function(aResponses) {

				})
				.fail(function() {
					new sap.m.MessageToast("Provide corresponding intent to navigate");
				});
			// generate the Hash to display a employee Id
			var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
				target: {
					semanticObject: "ZEAM_MVN_SEM_OBJ",
					action: "approve"
					
				}
			})) || "";
			//Generate a  URL for the second application
			var url = window.location.href.split('#')[0] + hash+"&/"+pattern;
			//Navigate to second app
			sap.m.URLHelper.redirect(url, false);
		},
		navActionItemSemobj: function() {
			// this.oRouter.navTo("mvn_asset_TranAcs_Search");
			var pattern = "mvn/asset/action_item";
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			// oCrossAppNavigator.isIntentSupported(["ZEAM_MVN_SEM_OBJ-display"])
			// 	.done(function(aResponses) {

			// 	})
			// 	.fail(function() {
			// 		new sap.m.MessageToast("Provide corresponding intent to navigate");
			// 	});
			
			var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
				target: {
					semanticObject: "ZEAM_MVN_SEM_OBJ",
					action: "manage"
					
				}
			})) || "";
			//Generate a  URL for the second application
			var url = window.location.href.split('#')[0] + hash+"&/"+pattern;
			//Navigate to second app
			sap.m.URLHelper.redirect(url, false);
		},
		navHomeSemobj: function() {
			// this.oRouter.navTo("mvn_asset_TranAcs_Search");
			// var pattern = "mvn/asset/action_item";
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			// oCrossAppNavigator.isIntentSupported(["ZEAM_MVN_SEM_OBJ-display"])
			// 	.done(function(aResponses) {

			// 	})
			// 	.fail(function() {
			// 		new sap.m.MessageToast("Provide corresponding intent to navigate");
			// 	});
			
			var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
				target: {
					semanticObject: "ZEAM_MVN_SEM_OBJ",
					action: "monitor"
					
				}
			})) || "";
			//Generate a  URL for the second application
			var url = window.location.href.split('#')[0] + hash;
			//Navigate to second app
			sap.m.URLHelper.redirect(url, false);
		},
		onPressGoToMaster: function () {
			this.getSplitContObj().toMaster(this.createId("idMasterReport"));
		}
		

	});
});