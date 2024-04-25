sap.ui.define([], function () {
    "use strict";
    var BusyIndicator = sap.ui.core.BusyIndicator;
   	var that = this;
    var Common = function () {
        // Do not use the constructor
        throw new Error();
    };
    
    
    Common.fnGetURL = function (sPath) {
    	
        var sDestination = "";
        var sRetVal = "";
        
        
        
        if (sPath) {
            if (sPath.charAt(0) !== "/") {
                sPath = "/" + sPath;
            }
        }
          if (window.location.href.indexOf("localhost") > -1) {
            sDestination = "/gwd";
        }
        
        sRetVal = sDestination + sPath;
        return sRetVal;
    };
   Common.getAjax =function(url, busyIndicatior) {
			if (busyIndicatior) {
				BusyIndicator.show();
			}
			
			var domUrl = this.fnGetURL(url);
			return new Promise(function(success, error) {
				$.ajax({
					url: domUrl,
					method: "GET",
					contentType: "application/json",
					dataType: "json",
					success: function(oDataReturn) {
						success(oDataReturn);
						if (busyIndicatior) {
							BusyIndicator.hide();
						}
					},
					error: function(oDataError) {
						error(oDataError);
						if (busyIndicatior) {
							BusyIndicator.hide();
						}
					}
				});
			});
		};
		Common.postAjax= function(url, payload, busyIndicatior) {
			if (busyIndicatior) {
				BusyIndicator.show();
			}
			var domUrl = this.fnGetURL(url);
			return new Promise(function(success, error) {
				$.ajax({
					url: domUrl,
					method: "POST",
					contentType: "application/json",
					dataType: "json",
					processData: false,
					data: JSON.stringify(payload),
					headers: {
						"X-Requested-With": "XMLHttpsRequest"
					},
					success: function(oDataReturn) {
						success(oDataReturn);
						if (busyIndicatior) {
							BusyIndicator.hide();
						}
					},
					error: function(oDataError) {
						error(oDataError);
						BusyIndicator.hide();
					}
				});
			});
		};
    return Common;
}, true);