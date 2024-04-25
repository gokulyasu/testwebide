sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/maventic/asset/Home/utility/Formatter",
	"com/maventic/asset/Home/utility/Common",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"sap/ui/model/Sorter",
	"sap/ui/export/Spreadsheet",
	"sap/ushell/services/CrossApplicationNavigation"
], function(Controller, Formatter, Common, MessageBox, Fragment, Sorter, Spreadsheet, CrossApplicationNavigation) {
	"use strict";
	return Controller.extend("com.maventic.asset.Home.controller.Home", {
		onInit: function() {
			this.getData();
			this.getHomeVisibility();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.attachRouteMatched(this.onRouteMatched, this);
		},
		onRouteMatched: function() {
			this.getData();
			// Window.objMatchedName = "mvn_asset_home" ;
		},
		getData: function() {
			var res, tab1, tab2, oModel;
			var that = this;
			var url =
				"/sap/opu/odata/MVN/ASSET_INWARD_SRV/InwardUserIDSet(UserId='')?$expand=InwardWorkListSet,InwardWorkNotifSet&$format=json";
			Common.getAjax(url, true).then(function(success) {
				tab1 = success.d.InwardWorkListSet.results;
				tab2 = success.d.InwardWorkNotifSet.results;
				oModel = that.getView().getModel("mMainModel");
				tab1.forEach(function(item) {
					if ((item.AssetNo === "" || item.AssetNo === undefined || item.AssetNo === null) || (item.AssetName === "" || item.AssetName ===
							undefined || item.AssetName === null)) {
						item.AssetName = item.AssetNo + item.AssetName;
					} else {
						item.AssetName = item.AssetNo + "\n" + item.AssetName;
					}
					item.RequestDateText = (item.RequestDate) ? Formatter.ConvDateforComments(item.RequestDate) : "";
					item.RequestDateSort = (item.RequestDate) ? Number((item.RequestDate.replace('/Date(', '')).replace(')/', '')) : null;
					if (item.Status === 'AP') {
						item.StatusText = "Approved";
					} else if (item.Status === 'RT') {
						item.StatusText = "Return";
					}
					if (item.Status === 'PE') {
						item.StatusText = "Pending";
					}
					if (item.Status === 'AP') {
						item.StatusText = "Approved";
					}
					if (item.Status === 'CH') {
						item.StatusText = "Checked";
					}
					if (item.Status === 'RJ' || item.Status === 'RE') {
						item.StatusText = "Rejected";
					}
				});
				tab2.forEach(function(item) {
					item.AssetNo = item.AssetNo + "" + item.AccessoryNo;
					item.AssetName = item.AssetName + "" + item.AccessoryDesc;
					if ((item.AssetNo === "" || item.AssetNo === undefined || item.AssetNo === null) & (item.AssetName === "" || item.AssetName ===
							undefined || item.AssetName === null)) {
						item.AssetName = item.AssetNo + item.AssetName;
					} else {
						item.AssetName = item.AssetNo + "\n" + item.AssetName;
					}
				});
				oModel.setProperty("/table1", tab1);
				oModel.setProperty("/table2", tab2);
			}).catch(function(error) {
				////Log.error(error.toString());
				res = error;
				oModel = that.getView().getModel("mMainModel");
				oModel.setProperty("/table1", []);
			});
		},
		onSearchTable1: function(oEvent) {
			var TableId = "ActionItemTabId";
			var filter0, filter1, filter2, filter3, filter4, filter5;
			var filterArr = [];
			var inputValue = oEvent.mParameters.newValue;
			filter0 = new sap.ui.model.Filter("RequestNo", sap.ui.model.FilterOperator.Contains, inputValue);
			filter1 = new sap.ui.model.Filter("AssetName", sap.ui.model.FilterOperator.Contains, inputValue);
			filter2 = new sap.ui.model.Filter("RequestDateText", sap.ui.model.FilterOperator.Contains, inputValue);
			filter3 = new sap.ui.model.Filter("RequestTypeDesc", sap.ui.model.FilterOperator.Contains, inputValue);
			filter4 = new sap.ui.model.Filter("StatusText", sap.ui.model.FilterOperator.Contains, inputValue);
			filter5 = new sap.ui.model.Filter("CrName", sap.ui.model.FilterOperator.Contains, inputValue);
			filterArr = [filter0, filter1, filter2, filter3, filter4, filter5];
			var tableId = this.byId(TableId);
			var oBinding = tableId.getBinding("items");
			var finalFilter = new sap.ui.model.Filter({
				filters: filterArr,
				and: false
			});
			oBinding.filter(finalFilter);
		},
		onSort1: function() {
			var oView = this.getView();
			var sName, Id;
			sName = "com.maventic.asset.Home.view.fragment.Table1Sort";
			Id = "table1";
			if (!this.byId(Id)) {
				Fragment.load({
					id: oView.getId(),
					name: sName,
					controller: this
				}).then(function(oDialog) {
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId(Id).open();
			}
		},
		onSortDialogConfirm1: function(oEvent) {
			var TableId = "ActionItemTabId";
			var oSortItem = oEvent.getParameter("sortItem");
			var sColumnPath;
			var bDescending = oEvent.getParameter("sortDescending");
			var oSorters = [];
			if (oSortItem) {
				sColumnPath = oSortItem.getKey();
			}
			oSorters.push(new Sorter(sColumnPath, bDescending));
			var oTable = this.byId(TableId);
			var oBinding = oTable.getBinding("items");
			oBinding.sort(oSorters);
		},
		onSearchTable2: function(oEvent) {
			var TableId = "NotificationTabId";
			var filter0, filter1, filter2;
			var filterArr = [];
			var inputValue = oEvent.mParameters.newValue;
			filter0 = new sap.ui.model.Filter("RequestNo", sap.ui.model.FilterOperator.Contains, inputValue);
			filter1 = new sap.ui.model.Filter("AssetName", sap.ui.model.FilterOperator.Contains, inputValue);
			filter2 = new sap.ui.model.Filter("Notification", sap.ui.model.FilterOperator.Contains, inputValue);
			filterArr = [filter0, filter1, filter2];
			var tableId = this.byId(TableId);
			var oBinding = tableId.getBinding("items");
			var finalFilter = new sap.ui.model.Filter({
				filters: filterArr,
				and: false
			});
			oBinding.filter(finalFilter);
		},
		onSort2: function() {
			var oView = this.getView();
			var sName, Id;
			sName = "com.maventic.asset.Home.view.fragment.Table2Sort";
			Id = "table2";
			if (!this.byId(Id)) {
				Fragment.load({
					id: oView.getId(),
					name: sName,
					controller: this
				}).then(function(oDialog) {
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId(Id).open();
			}
		},
		onSortDialogConfirm2: function(oEvent) {
			var TableId = "NotificationTabId";
			var oSortItem = oEvent.getParameter("sortItem");
			var sColumnPath;
			var bDescending = oEvent.getParameter("sortDescending");
			var oSorters = [];
			if (oSortItem) {
				sColumnPath = oSortItem.getKey();
			}
			oSorters.push(new Sorter(sColumnPath, bDescending));
			var oTable = this.byId(TableId);
			var oBinding = oTable.getBinding("items");
			oBinding.sort(oSorters);
		},
		onExport1: function() {
			var aCols, oRowBinding, oSettings, oSheet, TableId, oTable, oFile;
			TableId = "ActionItemTabId";
			oFile = "Home Action Item.xlsx";
			this._oTable = this.byId(TableId);
			oTable = this._oTable;
			oRowBinding = oTable.getBinding('items');
			aCols = this.createColumnConfig1();
			oSettings = {
				workbook: {
					columns: aCols,
					hierarchyLevel: 'Level'
				},
				dataSource: oRowBinding,
				fileName: oFile,
				worker: false
			};
			oSheet = new Spreadsheet(oSettings);
			oSheet.build().finally(
				function() {
					oSheet.destroy();
				});
		},
		createColumnConfig1: function() {
			var aCols = [];
			aCols.push({
				label: 'Request Type Description',
				property: 'RequestTypeDesc'
			});
			aCols.push({
				label: 'Request Number',
				property: 'RequestNo'
			});
			aCols.push({
				label: 'Asset Name',
				property: 'AssetName'
			});
			aCols.push({
				label: 'Status',
				property: 'StatusText'
			});
			aCols.push({
				label: 'Request Date',
				property: 'RequestDateText'
			});
			aCols.push({
				label: 'Pending with',
				property: 'CrName'
			});
			return aCols;
		},
		onExport2: function() {
			var aCols, oRowBinding, oSettings, oSheet, TableId, oTable, oFile;
			TableId = "NotificationTabId";
			oFile = "Home Notification.xlsx";
			this._oTable = this.byId(TableId);
			oTable = this._oTable;
			oRowBinding = oTable.getBinding('items');
			aCols = this.createColumnConfig2();
			oSettings = {
				workbook: {
					columns: aCols,
					hierarchyLevel: 'Level'
				},
				dataSource: oRowBinding,
				fileName: oFile,
				worker: false
			};
			oSheet = new Spreadsheet(oSettings);
			oSheet.build().finally(
				function() {
					oSheet.destroy();
				});
		},
		createColumnConfig2: function() {
			var aCols = [];
			aCols.push({
				label: 'Request Number',
				property: 'RequestNo'
			});
			aCols.push({
				label: 'Asset Name',
				property: 'AssetName'
			});
			aCols.push({
				label: 'Notification',
				property: 'Notification'
			});
			return aCols;
		},
		getHomeVisibility: function() {
			var res, oModel;
			var that = this;
			oModel = that.getView().getModel("mMainModel");
			var url = "/sap/opu/odata/MVN/ASSET_INWARD_SRV/GetHomePage?UserID=''&$format=json";
			Common.getAjax(url, true).then(function(success) {
				oModel = that.getView().getModel("mMainModel");
				res = success.d;
				for (var item in res) {
					res[item] = (res[item] === 'X') ? true : false;
				}
				if (res) {
					oModel.setProperty("/VisibleTiles", res);
					oModel.setProperty("/VisibleTile1", res.GrpIn);
					oModel.setProperty("/VisibleTile2", res.GrpInt);
					oModel.setProperty("/VisibleTile3", res.GrpTrans);
					oModel.setProperty("/VisibleTile4", res.GrpPi);
					oModel.setProperty("/VisibleTile5", res.GrpRep);
					var tile1Items = [];
					var tile2Items = [];
					var tile3Items = [];
					var tile4Items = [];
					var tile5Items = [];
					//Tile 1 Items
					if (res.GrpIn) {
						if (res.InAst) {
							tile1Items.push({
								"name": "Inward of Asset"
							});
						}
						if (res.InAsc) {
							tile1Items.push({
								"name": "Inward of Accessory"
							});
						}
						if (res.InUpdateAsc) {
							tile1Items.push({
								"name": "Update Accessory Details"
							});
						}
						if (res.InAddSoft) {
							tile1Items.push({
								"name": "Add Software"
							});
						}
						if (res.InUpdtSoftware) {
							tile1Items.push({
								"name": "Update Software"
							});
						}
						if (res.InMassUpdtAst) {
							tile1Items.push({
								"name": "Mass Update of Asset"
							});
						}
						if (res.InMassUpdtAsc) {
							tile1Items.push({
								"name": "Mass Update of Accessories"
							});
						}
						if (res.OptChar1) {
							tile1Items.push({
								"name": "Non PO Asset"
							});
						}

					}
					//Tile 2 Items
					if (res.GrpInt) {
						if (res.IntAstCommDashboard) {
							tile2Items.push({
								"name": "Asset Common Dashboard"
							});
						}
						if (res.IntAlloNonAstAsc) {
							tile2Items.push({
								"name": "Allocation Non-Assets/Accesories"
							});
						}
						if (res.IntAscDeallocation) {
							tile2Items.push({
								"name": "Accesory De-Allocation"
							});
						}
						// if (res.IntAppAlloRequest) {
						//  tile2Items.push({
						//    "name": "Approve Allocation Request"
						//  });
						// }
					}
					//Tile 3 Items
					if (res.GrpTrans) {
						if (res.TransAscTransfer) {
							tile3Items.push({
								"name": "Accessory Transfer"
							});
						}
						if (res.TransReceive) {
							tile3Items.push({
								"name": "Receive Gatepass"
							});
						}
						if (res.TransActionItem) {
							tile2Items.push({
								"name": "Action Item"
							});
						}
						if (res.TransPrintGatepass) {
							tile3Items.push({
								"name": "Download/Print Gatepass"
							});
						}
					}
					//Tile 4 Items
					if (res.GrpPi) {
						if (res.PiCreat) {
							tile4Items.push({
								"name": "Create PI Assets"
							});
						}
						if (res.PiDisplayEdit) {
							tile4Items.push({
								"name": "Display/Edit Physical Inventory"
							});
						}
						if (res.PiReport) {
							tile4Items.push({
								"name": "Physical Inventory Report"
							});
						}
						tile4Items.push({
							"name": "Physical Verification"
						});
					}
					//Tile 5 Items
					if (res.GrpRep) {
						if (res.RepTransfer) {
							tile5Items.push({
								"name": "Asset Report"
							});
						}
						if (res.RepInwarding) {
							tile5Items.push({
								"name": "Accessory Report"
							});
						}
						if (res.RepInternalProcess) {
							tile5Items.push({
								"name": "Software Report"
							});
						}
						tile5Items.push({
							"name": "Mass Tag Printing"
						});
						// tile5Items.push({
						// 	"name": "Accessory Barcode"
						// });
					}
					var cardI = {
						"tile1": {
							"sap.app": {
								"id": "sample.CardsLayout.model.list2",
								"type": "card"
							},
							"sap.card": {
								"type": "List",
								"header": {
									"title": "Inwarding",
									"icon": {
										// "src": "sap-icon://idea-wall"
										"src": "sap-icon://sales-order-item"
									}
								},
								"content": {
									"data": {
										"json": tile1Items
									},
									"item": {
										"title": {
											"value": "{name}"
										},
										"description": {
											"value": "{description}"
										},

										"actions": [{
											"type": "Navigation",
											"parameters": {
												"SubHead": "PP{name}"
											}
										}]
									}
								}
							}
						},
						"tile2": {
							"sap.app": {
								"id": "sample.CardsLayout.model.list2",
								"type": "card"
							},
							"sap.card": {
								"type": "List",
								"header": {
									"title": "Internal Process",

									"icon": {
										// "src": "sap-icon://credit-card"
										"src": "sap-icon://learning-assistant"
									}
								},
								"content": {
									"data": {
										"json": tile2Items
									},
									"item": {

										"title": {
											"value": "{name}"
										},
										"description": {
											"value": "{description}"
										},
										"actions": [{
											"type": "Navigation",
											"parameters": {

												"SubHead": "RA{name}"
											}
										}]
									}
								}
							}
						},
						"tile3": {
							"sap.app": {
								"id": "sample.CardsLayout.model.list2",
								"type": "card"
							},
							"sap.card": {
								"type": "List",
								"header": {
									"title": "Intra/Inter Transfer",

									"icon": {
										// "src": "sap-icon://monitor-payments"
										"src": "sap-icon://org-chart"
									}
								},
								"content": {
									"data": {
										"json": tile3Items
									},
									"item": {

										"title": {
											"value": "{name}"
										},
										"description": {
											"value": "{description}"
										},
										"actions": [{
											"type": "Navigation",
											"parameters": {

												"SubHead": "IIT{name}"
											}
										}]
									}
								}
							}
						},
						"tile4": {
							"sap.app": {
								"id": "sample.CardsLayout.model.list2",
								"type": "card"
							},
							"sap.card": {
								"type": "List",
								"header": {
									"title": "Physical Invetory",

									"icon": {
										"src": "sap-icon://add-coursebook"
									}
								},
								"content": {
									"data": {
										"json": tile4Items
									},
									"item": {

										"title": {
											"value": "{name}"
										},
										"description": {
											"value": "{description}"
										},
										"actions": [{
											"type": "Navigation",
											"parameters": {

												"SubHead": "CC{name}"
											}
										}]
									}
								}
							}
						},
						"tile5": {
							"sap.app": {
								"id": "sample.CardsLayout.model.list2",
								"type": "card"
							},
							"sap.card": {
								"type": "List",
								"header": {
									"title": "Reports",

									"icon": {
										"src": "sap-icon://create-form"
									}
								},
								"content": {
									"data": {
										"json": tile5Items
									},
									"item": {

										"title": {
											"value": "{name}"
										},
										"description": {
											"value": "{description}"
										},
										"actions": [{
											"type": "Navigation",
											"parameters": {

												"SubHead": "RE{name}"
											}
										}]
									}
								}
							}
						}

					};
					oModel.setProperty("/cardI", cardI);

				}
				// oModel.setProperty("/table1", tab1);
				// oModel.setProperty("/table2", tab2);
			}).catch(function(error) {
				////Log.error(error.toString());
				res = error;
				oModel = that.getView().getModel("mMainModel");
				oModel.setProperty("/table1", []);
			});

		},
		onAction: function(oEvent) {
			var oRouter = this.getOwnerComponent().getRouter();

			var k = oEvent.getParameter("parameters").SubHead;
			if (k === 'RAAction Item') {
				oRouter.navTo("mvn_asset_action_item");
			} else if (k === 'IITCreate Transfer Request') {
				// oRouter.navTo("mvn_asset_tran_req_cr");
			} else if (k === 'PPNon PO Asset') {
				oRouter.navTo("mvn_asset_in_nonPOAsset");
			} else if (k === 'PPInward of Asset') {
				oRouter.navTo("mvn_asset_inwarding_inwardAsset_detail");
			} else if (k === 'PPUpdate Software') {
				oRouter.navTo("mvn_asset_inwarding_updateSoftware");
			} else if (k === 'RAAsset Common Dashboard') {
				oRouter.navTo("mvn_asset_co_db");
			} else if (k === 'PPInward of Accessory') {
				oRouter.navTo("mvn_asset_inwarding_inwardAccessory_detail");
			} else if (k === "PPUpdate Accessory Details") {
				oRouter.navTo("mvn_asset_inwarding_updateAccessory_detail");
			} else if (k === "PPMass Update of Asset") {
				oRouter.navTo("mvn_asset_inwarding_massUpdtAsset_detail");
			} else if (k === "PPMass Update of Accessories") {
				oRouter.navTo("mvn_asset_inwarding_massUpdtAccsry_detail");
			} else if (k === "PPAdd Software") {
				oRouter.navTo("mvn_asset_in_addSoftware");
			} else if (k === 'RAAllocation Non-Assets/Accesories') {
				oRouter.navTo("mvn_asset_accesssearch");
			} else if (k === 'CCCreate PI Assets') {
				// oRouter.navTo("projectCreate");
				oRouter.navTo("mvn_pi_create");
			} else if (k === 'CCDisplay/Edit Physical Inventory') {
				oRouter.navTo("mvn_pi_edit");
			} else if (k === 'CCPhysical Inventory Report') {
				oRouter.navTo("mvn_pire");
			} else if (k === 'CCPhysical Verification') {
				oRouter.navTo("com_maventic_MaventicVeifyPI");
			} else if (k === 'IITAccessory Transfer') {
				oRouter.navTo("mvn_asset_TranAcs_Search");
			} else if (k === 'IITReceive Gatepass') {
				oRouter.navTo("mvn_search_gatepass");
			} else if (k === 'RAAccesory De-Allocation') {
				oRouter.navTo("mvn_asset_accesdDealocSrh");
			} else if (k === 'REAsset Report') {
				this.onReportClick(k);
			} else if (k === 'REAccessory Report') {
				this.onReportClick(k);
			} else if (k === 'RESoftware Report') {
				this.onReportClick(k);
			} else if (k === 'REMass Tag Printing') {
				this.onReportClick(k);
				// this.onMassTagPrinting();
			}
		},
		onPressLogOff: function() {
			var url = "/sap/public/bc/icf/logoff";
			Common.getAjax(url, true).then(function(success) {
				window.location.reload();
			}).catch(function(error) {
				if (error.status === 200) {
					window.location.reload();
				}
				//Log.error(error);
			});
		},
		onPressActionItem: function(oEvent) {
			var k = oEvent.getSource().getBindingContextPath();
			var oRouter = this.getOwnerComponent().getRouter();
			var p = "mMainModel>" + k;
			var oModel = this.getView().getModel("mMainModel");
			var values = oModel.getProperty(k);
			window.homeActionFlag = "Home";
			var reqNo = values.RequestNo;
			var ReqType = values.RequestType;
			var statusType = values.Status;
			this.navTo("mvn_asset_tranfer_action_item_home", {
				"ReqNo": values.RequestNo,
				"reqType": values.RequestType,
				"statusType": values.Status
			});
			// }
		},
		onReportClick: function(report) {
			var oView = this.getView();
			var oModel = this.getView().getModel("mMainModel");
			if (report === 'REAsset Report') {
				oModel.setProperty("/VisibleFlag/title", 'Asset Report');
				oModel.setProperty("/VisibleFlag/icon", 'sap-icon://building');
				oModel.setProperty("/VisibleFlag/Asset", true);
				oModel.setProperty("/VisibleFlag/Accessory", false);
				oModel.setProperty("/VisibleFlag/Software", false);
				oModel.setProperty("/VisibleFlag/TagPrint", false);
			} else if (report === 'REAccessory Report') {
				oModel.setProperty("/VisibleFlag/title", 'Accessory Report');
				oModel.setProperty("/VisibleFlag/icon", 'sap-icon://add-equipment');
				oModel.setProperty("/VisibleFlag/Accessory", true);
				oModel.setProperty("/VisibleFlag/Asset", false);
				oModel.setProperty("/VisibleFlag/Software", false);
				oModel.setProperty("/VisibleFlag/TagPrint", false);
			} else if (report === 'RESoftware Report') {
				oModel.setProperty("/VisibleFlag/title", 'Software Report');
				oModel.setProperty("/VisibleFlag/icon", 'sap-icon://popup-window');
				oModel.setProperty("/VisibleFlag/Software", true);
				oModel.setProperty("/VisibleFlag/Asset", false);
				oModel.setProperty("/VisibleFlag/Accessory", false);
				oModel.setProperty("/VisibleFlag/TagPrint", false);
			} else if (report === 'REMass Tag Printing') {
				oModel.setProperty("/VisibleFlag/title", 'Mass Tag Printing');
				oModel.setProperty("/VisibleFlag/icon", 'sap-icon://bar-code');
				oModel.setProperty("/VisibleFlag/TagPrint", true);
				oModel.setProperty("/VisibleFlag/Software", false);
				oModel.setProperty("/VisibleFlag/Asset", false);
				oModel.setProperty("/VisibleFlag/Accessory", false);
			}
			var sName, Id;
			sName = "com.maventic.asset.Home.view.fragment.ReportPopup";
			Id = "ReportPopupId";
			var con = false;
			// var code = new sap.m.Dialog({
			// 	begginButton: new sap.m.Button({
			// 		text: "Close",
			// 		press: ""
			// 	})

			// });
			// code.open();
			if (!this.oRemarkDialog) {
				this.oRemarkDialog = sap.ui.xmlfragment(
					sName, this);
				var i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties"
				});
				this.oRemarkDialog.setModel(i18nModel, "i18n");
				this.oRemarkDialog.setModel(oModel, "mMainModel");
			}
			this.oRemarkDialog.open();
			if (con) {
				if (!this.byId(Id)) {
					Fragment.load({
						id: oView.getId(),
						name: sName,
						controller: this
					}).then(function(oDialog) {
						oView.addDependent(oDialog);
						oDialog.open();
					});
				} else {
					this.byId(Id).open();
				}
			}
		},
		onCloseReportPopup: function() {
			this.oRemarkDialog.close();
			this.oRemarkDialog.destroy(true);
			this.oRemarkDialog = undefined;
		},
		onAssetMasterReport: function() {
			// var oRouter = this.getOwnerComponent().getRouter();
			// oRouter.navTo("ASSET_MSTR");
			this.onSemObjActionWOParms("p_ASSET_MSTR", "zeam_mvn_asset", "display");
		},
		onAssetTransferReport: function() {
			// var oRouter = this.getOwnerComponent().getRouter();
			// oRouter.navTo("ASSET_TRANS");
			this.onSemObjActionWOParms("p_ASSET_TRANS", "zeam_mvn_asset", "display");
		},
		onAssetAllocationReport: function() {
			// var oRouter = this.getOwnerComponent().getRouter();
			// oRouter.navTo("ASSET_ALLOC");
			this.onSemObjActionWOParms("p_ASSET_ALLOC", "zeam_mvn_asset", "display");
		},
		onAccessoryMasterReprot: function() {
			// var oRouter = this.getOwnerComponent().getRouter();
			// oRouter.navTo("ASSET_AS_SEARCH");
			// this.onSemObjActionWOParms("p_ASSET_ALLOC", "zeam_mvn_asset", "display");
		},
		onAccessoryTransferReport: function() {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("ASSET_ACS_TRANS");
		},
		onAccessoryAllocReport: function() {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("ASSET_AS_ALOC");
		},
		onSoftwareAlloctionReport: function() {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("ASSET_SOFT_ALOC");
		},
		onSoftwareMasterReport: function() {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("ASSET_SFT_MSTR");
		},
		onAssetAMCReport: function() {
			// var oRouter = this.getOwnerComponent().getRouter();
			// oRouter.navTo("ASSET_AST_AMC");
			this.onSemObjActionWOParms("p_ASSET_AST_AMC", "zeam_mvn_asset", "display");

		},
		onAccessoryAmcReport: function() {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("ASSET_ACS_AMC");
		},
		onSoftwareAMCreport: function() {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("ASSET_SOFT_AMC");
		},
		onAssetBarcodePrint: function() {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("ASSET_BC_PRINT");
		},
		onAccessoryBarcodePrint: function() {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("ASSET_AC_BRCODE");
		},
		onCallTCode: function(tCode) {
			var navigationService = sap.ushell.Container.getService('CrossApplicationNavigation');
			var hash = navigationService.hrefForExternal({
				target: {
					semanticObject: "MVNTile",
					action: "register"
				},
				params: {
					Type: tCode
				}
			});
			var url = window.location.href.split('#')[0] + hash;
			sap.m.URLHelper.redirect(url, true);
		},
		navInward: function() {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("mvn_asset_inwarding_inwardAsset_detail");
		},
		onInwardofAsset: function() {
			var pattern = "mvn/asset/inwarding/inwardofasset";
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
				target: {
					semanticObject: "ZEAM_MVN_SEM_OBJ",
					action: "approve"
				}
			})) || "";
			var url = window.location.href.split("#")[0] + hash + "&/" + pattern;
			sap.m.URLHelper.redirect(url, false);
		},
		onActionItem: function() {
			var pattern = "mvn/asset/action_item";
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
				target: {
					semanticObject: "ZEAM_MVN_SEM_OBJ",
					action: "manage"
				}
			})) || "";
			var url = window.location.href.split('#')[0] + hash + "&/" + pattern;
			sap.m.URLHelper.redirect(url, false);
		},
		navHomeSemobj: function() {
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
				target: {
					semanticObject: "ZEAM_MVN_SEM_OBJ",
					action: "monitor"
				}
			})) || "";
			var url = window.location.href.split('#')[0] + hash;
			sap.m.URLHelper.redirect(url, false);
		},
		onInwardOfAccessorySem: function() {
			this.onSemObjActionWOParms("mvn/asset/inwarding/inwardofaccessory", "zeam_mvn_asset", "approve");
		},
		onUpdateAccessorySem: function() {
			this.onSemObjActionWOParms("mvn/asset/inwarding/updateaccessory", "zeam_mvn_asset", "displayFactSheet");
		},
		onCommonDBSem: function() {
			this.onSemObjActionWOParms("mvn_asset_co_db", "ZEAM_MVN_SEM_OBJ", "monitor");
		},
		onAllocNonAsseSem: function() {
			this.onSemObjActionWOParms("mvn_asset_accesssearch", "ZEAM_MVN_SEM_OBJ", "monitor");
		},
		onSearchGatepassSem: function() {
			this.onSemObjActionWOParms("SearchGatepass", "ZEAM_MVN_SEM_OBJ", "manageLineItems");
		},
		onAssetMstrSem: function() {
			this.onSemObjActionWOParms("p_ASSET_MSTR", "zeam_mvn_asset", "display");
		},
		onAssetTrSem: function() {
			this.onSemObjActionWOParms("p_ASSET_TRANS", "zeam_mvn_asset", "display");
		},
		onNonPOAsset: function() {
			// this.onSemObjActionWOParms("mvn/asset/inwarding/nonpoasset", "ZEAM_MVN_SEM_OBJ", "displayFactSheet");
			this.onSemObjActionWOParms("NonPoSrch", "ZEAM_MVN_SEM_OBJ", "displayFactSheet");
		},
		onCreatePIAssets: function() {
			this.onSemObjActionWOParms("mvn_pi_create", "ZEAM_MVN_SEM_OBJ", "release");
		},
		onDisplayEditPI: function() {
			this.onSemObjActionWOParms("mvn_pi_edit", "ZEAM_MVN_SEM_OBJ", "release");
		},
		onPhysicalInventoryReport: function() {
			this.onSemObjActionWOParms("mvn_pire", "ZEAM_MVN_SEM_OBJ", "lookup");
		},
		onPhysicalVerification: function() {
			this.onSemObjActionWOParms("Verify_PI", "zeam_mvn_asset", "approve");
		},
		onPressGoToMaster: function() {
			this.getView().byId("SplitContDemo").toMaster(this.createId("idMasterReport"));
		},
		onPressMasterBack: function() {
			this.getView().byId("SplitContDemoReport").backMaster();
		},
		onInwarding: function() {
			this.getView().byId("SplitContDemo").toDetail(this.createId("IdInwarding"));
		},
		onIProcess: function() {
			this.getView().byId("SplitContDemo").toDetail(this.createId("IdInternalProcess"));
		},
		onInTransfer: function() {
			this.getView().byId("SplitContDemo").toDetail(this.createId("IdinterIntraTransfer"));
		},
		onPhysicalInventory: function() {
			this.getView().byId("SplitContDemo").toDetail(this.createId("IdPhysicalInventory"));
		},
		onReport: function() {
			this.getView().byId("SplitContDemo").toDetail(this.createId("IdReport"));
		},
		onAssetReport: function() {
			// this.getView().byId("SplitContDemoReport").toMaster(this.createId("IdAssetDetailReport"));
			this.onReportClick("REAsset Report");
		},
		onAccessoryReport: function() {
			this.getView().byId("SplitContDemoReport").toMaster(this.createId("IdAccDetailReport"));
		},
		onSoftwareReport: function() {
			this.getView().byId("SplitContDemoReport").toMaster(this.createId("IdSoftwareReport"));
		},
		onMassTagPrinting: function() {
			this.onSemObjActionWOParms("p_BC_PRINT", "zeam_mvn_asset", "display");
			// this.getView().byId("SplitContDemoReport").toMaster(this.createId("IdMassTagPrinting"));
		},
		onAssetGraphicalReport: function() {
			this.onSemObjActionWOParms("GraphicalReport", "ZEAM_MVN_SEM_OBJ", "lookup");
		},
		navTo: function(routeName, params) {
			var manifestRoutes = {
				"routes": [{
					"name": "mvn_asset_tranfer_action_item_home",
					"pattern": "mvn_action_item_home/{ReqNo}/{reqType}/{statusType}",
					"target": "mvn_asset_action_item"
				}, {
					"name": "mvn_asset_inwarding_inwardAsset_detail",
					"pattern": "mvn/asset/inwarding/inwardofasset",
					"target": "mvn_asset_inwarding_inwardAsset_detail"
				}, {
					"name": "mvn_asset_action_item",
					"pattern": "mvn/asset/action_item",
					"target": "mvn_asset_action_item"
				}, {
					"name": "mvn_asset_tran_req_cr",
					"pattern": "mvn_asset_tran_req_cr",
					"target": "mvn_asset_tran_req_cr"
				}, {
					"name": "mvn_asset_co_db",
					"pattern": "mvn_asset_co_db",
					"target": "mvn_asset_co_db"
				}, {
					"name": "mvn_asset_home",
					"pattern": "",
					"target": "mvn_asset_home"
				}, {
					"name": "mvn_asset_inwarding_inwardAccessory_detail",
					"pattern": "mvn/asset/inwarding/inwardofaccessory",
					"target": "mvn_asset_inwarding_inwardAccessory_detail"
				}, {
					"name": "mvn_asset_inwarding_updateAccessory_detail",
					"pattern": "mvn/asset/inwarding/updateaccessory",
					"target": "mvn_asset_inwarding_updateAccessory_detail"
				}, {
					"name": "mvn_asset_in_addSoftware",
					"pattern": "mvn/asset/inwarding/addsoftware",
					"target": "mvn_asset_in_addSoftware"
				}, {
					"name": "mvn_asset_accesssearch",
					"pattern": "mvn_asset_accesssearch",
					"target": "mvn_asset_accesssearch"
				}, {
					"name": "mvn_pi_create",
					"pattern": "mvn_pi_create",
					"target": "mvn_pi_create"
				}, {
					"name": "mvn_pi_edit",
					"pattern": "mvn_pi_edit",
					"target": "mvn_pi_create"
				}, {
					"name": "mvn_pire",
					"pattern": "mvn_pire",
					"target": "mvn_pire"
				}, {
					"name": "mvn_asset_TranAcs_Search",
					"pattern": "mvn_asset_TranAcs_Search",
					"target": "mvn_asset_TranAcs_Search"
				}, {
					"name": "mvn_asset_inwarding_updateSoftware",
					"pattern": "mvn/asset/inwarding/updatesoftware",
					"target": "mvn_asset_inwarding_updateSoftware"
				}, {
					"name": "mvn_search_gatepass",
					"pattern": "SearchGatepass",
					"target": "mvn_search_gatepass"
				}, {
					"name": "mvn_asset_accesdDealocSrh",
					"pattern": "p_asset_accesdDealocSrh",
					"target": "mvn_asset_accesdDealocSrh"
				}, {
					"name": "mvn_asset_tran_req_rt",
					"pattern": "mvn_asset_tran_req_rt/{ReqNo}",
					"target": "mvn_asset_tran_req_cr"
				}, {
					"name": "mvn_asset_tranfer_action_item_home",
					"pattern": "mvn_action_item_home/{ReqNo}/{reqType}/{statusType}",
					"target": "mvn_asset_action_item"
				}, {
					"name": "mvn_asset_tranfer_asset_approve",
					"pattern": "TransferApprove/{ReqNo}/{ReqStatus}",
					"target": "mvn_asset_action_item"
				}, {
					"name": "com_maventic_MaventicVeifyPI",
					"pattern": "Verify_PI",
					"target": "com_maventic_MaventicVeifyPI"
				}, {
					"name": "mvn_asset_in_nonPOAsset",
					"pattern": "mvn/asset/inwarding/nonpoasset",
					"target": "mvn_asset_in_nonPOAsset"
				}, {
					"name": "ASSET_MSTR",
					"pattern": "p_ASSET_MSTR",
					"target": "mvn_asset_reports"
				}, {
					"name": "ASSET_TRANS",
					"pattern": "p_ASSET_TRANS",
					"target": "mvn_asset_reports"
				}, {
					"name": "ASSET_ALLOC",
					"pattern": "p_ASSET_ALLOC",
					"target": "mvn_asset_reports"
				}, {
					"name": "ASSET_AS_SEARCH",
					"pattern": "AsSearch",
					"target": "mvn_asset_reports"
				}, {
					"name": "ASSET_ACS_TRANS",
					"pattern": "ACSTRANS",
					"target": "mvn_asset_reports"
				}, {
					"name": "ASSET_AS_ALOC",
					"pattern": "ASALOC",
					"target": "mvn_asset_reports"
				}, {
					"name": "ASSET_SOFT_ALOC",
					"pattern": "SOFTALOC",
					"target": "mvn_asset_reports"
				}, {
					"name": "ASSET_SFT_MSTR",
					"pattern": "SFTMSTR",
					"target": "mvn_asset_reports"
				}, {
					"name": "ASSET_AST_AMC",
					"pattern": "p_ASSET_AST_AMC",
					"target": "mvn_asset_reports"
				}, {
					"name": "ASSET_ACS_AMC",
					"pattern": "ACSAMC",
					"target": "mvn_asset_reports"
				}, {
					"name": "ASSET_SOFT_AMC",
					"pattern": "SOFTAMC",
					"target": "mvn_asset_reports"
				}, {
					"name": "ASSET_BC_PRINT",
					"pattern": "p_ASSET_BC_PRINT",
					"target": "mvn_asset_reports"
				}, {
					"name": "ASSET_AC_BRCODE",
					"pattern": "ACBRCODE",
					"target": "mvn_asset_reports"
				}],
				"targets": {
					"mvn_asset_reports": {
						"type": "Component",
						"usage": "mvn_asset_reports"
					},
					"mvn_asset_home": {
						"viewType": "XML",
						"viewName": "Home",
						"transition": "slide",
						"clearControlAggregation": false
					},
					"com_maventic_MaventicVeifyPI": {
						"type": "Component",
						"usage": "com_maventic_MaventicVeifyPI"
					},
					"mvn_asset_action_item": {
						"type": "Component",
						"usage": "mvn_asset_tr_ac_itm",
						"semObj": "ZEAM_MVN_SEM_OBJ",
						"action": "manage"
					},
					"mvn_asset_inwarding_inwardAsset_detail": {
						"type": "Component",
						"usage": "mvn_asset_in_asset"
					},
					"mvn_asset_tran_req_cr": {
						"type": "Component",
						"usage": "asset_tr_req"
					},
					"mvn_asset_co_db": {
						"type": "Component",
						"usage": "asset_cdb"
					},
					"mvn_asset_inwarding_inwardAccessory_detail": {
						"type": "Component",
						"usage": "mvn_asset_in_inwardAccessory"
					},
					"mvn_asset_inwarding_updateAccessory_detail": {
						"type": "Component",
						"usage": "mvn_asset_in_updateAccessory"
					},
					"mvn_asset_in_addSoftware": {
						"type": "Component",
						"usage": "mvn_asset_in_addSoftware"
					},
					"mvn_asset_accesssearch": {
						"type": "Component",
						"usage": "mvn_asset_accesssearch"
					},
					"mvn_pi_create": {
						"type": "Component",
						"usage": "mvn_asset_pi"
					},
					"mvn_pire": {
						"type": "Component",
						"usage": "mvn_asset_pire"
					},
					"mvn_asset_TranAcs_Search": {
						"type": "Component",
						"usage": "mvn_asset_TranAcs_Search"
					},
					"mvn_asset_inwarding_updateSoftware": {
						"type": "Component",
						"usage": "mvn_asset_in_updt_software"
					},
					"mvn_search_gatepass": {
						"type": "Component",
						"usage": "mvn_asset_search_gatepass"
					},
					"mvn_asset_accesdDealocSrh": {
						"type": "Component",
						"usage": "mvn_asset_search_deallocate"
					},
					"mvn_asset_in_nonPOAsset": {
						"type": "Component",
						"usage": "mvn_asset_in_nonPOAsset"
					}
				}
			};

			var route = manifestRoutes.routes.find(function(item) {
				return item.name === routeName;
			});
			var target = "";
			for (var item in manifestRoutes.targets) {
				if (item === route.target) {
					target = manifestRoutes.targets[item];
					break;
				}
			}

			if (target.type === "XML") {
				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo(routeName, params);
			} else if (target.type === "Component") {
				var pattern = route.pattern;
				for (var itemP in params) {
					pattern = pattern.replace("{" + itemP + "}", params[itemP]);
				}
				var semObj = target.semObj;
				var action = target.action;
				this.onSemObjActionWOParms(pattern, semObj, action);
			}

		},
		onSemObjActionWOParms: function(pattern, semObj, action) {
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
				target: {
					semanticObject: semObj,
					action: action
				}
			})) || "";
			var url = window.location.href.split('#')[0] + hash + "&/" + pattern;
			sap.m.URLHelper.redirect(url, false);
		}
	});
});