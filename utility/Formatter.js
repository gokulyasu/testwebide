jQuery.sap.declare("com.maventic.asset.Home.utility.Formatter");

com.maventic.asset.Home.utility.Formatter = {
	onInit: function(oResourceBundle) {
		this._oResourceBundle = oResourceBundle;
	},

	fnRoundOff: function(sValue) {
		return Math.round(sValue);
	},
	ConvDate: function(sValue) {
		if (sValue !== null) {
			// var aMonthsList=["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			//    sValue = new Date(Number(sValue.replace("/Date(", "").replace(")/", "")));
			// var sYear = sValue.getFullYear();
			// var sMonth = sValue.getMonth();
			// var sDate = ((sValue.getDate() < 10) ? ("0" + (sValue.getDate())) : sValue.getDate());
			// var sRet = aMonthsList[sMonth] + " " + sDate + ", " + sYear;
			//           var date = new Date(sValue);
			// var formattedDate = sap.ui.core.format.DateFormat.getDateInstance().format(date); // format the date using default date format

			var DateFrom = sValue;
			DateFrom = DateFrom + "T00:00:00+0000";
			DateFrom = new Date(DateFrom).getTime();
			// var sRet = "Hello";
			return DateFrom;
			// return sValue.getDate() + "/" + (sValue.getMonth() + 1) + "/" + sValue.getFullYear();
		} else if ((sValue) === null || sValue === undefined) {
			return null;
		} else {
			return "Jan 01,0000";
		}
	},
	ConvDateforComments: function(sValue) {
		if (sValue !== null && sValue !== undefined && sValue[0] === "/") {
			var substr = sValue.match(/\(([^)]+)\)/)[1];
			sValue = new Date(Number(substr));
			var aMonthsList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
			//    sValue = new Date(Number(sValue.replace("/Date(", "").replace(")/", "")));
			var sYear = sValue.getFullYear();
			var sMonth = sValue.getMonth();
			var sDate = ((sValue.getDate() < 10) ? ("0" + (sValue.getDate())) : sValue.getDate());
			var sRet = aMonthsList[sMonth] + " " + sDate + " " + sYear;
			return sRet; //+ " "+sValue.toLocaleTimeString();
			// return sValue.getDate() + "/" + (sValue.getMonth() + 1) + "/" + sValue.getFullYear();
		} else {
			return null;
		}
	},
	ConvDateNumber: function(sValue) {
		if (sValue !== null) {

			var sYear = sValue.getFullYear();
			var sMonth = sValue.getMonth() + 1;
			var sDate = ((sValue.getDate() < 10) ? ("0" + (sValue.getDate())) : sValue.getDate());
			var sRet = sDate + "." + sMonth + "." + sYear;
			return sRet;
			// return sValue.getDate() + "/" + (sValue.getMonth() + 1) + "/" + sValue.getFullYear();
		} else {
			return "01.01.0000";
		}
	},
	ConvEpoch: function(changeDate) {
		if (!(changeDate === null ||
				// isNaN(changeDate) || 
				changeDate === undefined || changeDate === "")) {
			var DateFrom = changeDate;
			DateFrom = DateFrom + "T00:00:00+0000";
			DateFrom = new Date(DateFrom).getTime();
			return "/Date(" + DateFrom + ")/";
		} else {
			return null;
		}
	},
	BrackValue: function(val) {
		var res = val.match(/\(([^)]+)\)/)[1];
		return res;
	}
};