const mthNamesEn = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
const dayNamesEn = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
const zeroPad = (n :number) => ("0" + n).substr(-2, 2);

export const DERIVERS = {
	bin: function(col, binWidth) {
		return function(record) {
			return record[col] - record[col] % binWidth;
		};
	},
	dateFormat: function(col, formatString, utcOutput, mthNames, dayNames) {
		var utc;
		if (utcOutput == null) {
			utcOutput = false;
		}
		if (mthNames == null) {
			mthNames = mthNamesEn;
		}
		if (dayNames == null) {
			dayNames = dayNamesEn;
		}
		utc = utcOutput ? "UTC" : "";
		return function(record) {
			var date;
			date = new Date(Date.parse(record[col]));
			if (isNaN(date)) {
				return "";
			}
			return formatString.replace(/%(.)/g, function(m, p) {
				switch (p) {
					case "y":
						return date["get" + utc + "FullYear"]();
					case "m":
						return zeroPad(date["get" + utc + "Month"]() + 1);
					case "n":
						return mthNames[date["get" + utc + "Month"]()];
					case "d":
						return zeroPad(date["get" + utc + "Date"]());
					case "w":
						return dayNames[date["get" + utc + "Day"]()];
					case "x":
						return date["get" + utc + "Day"]();
					case "H":
						return zeroPad(date["get" + utc + "Hours"]());
					case "M":
						return zeroPad(date["get" + utc + "Minutes"]());
					case "S":
						return zeroPad(date["get" + utc + "Seconds"]());
					default:
						return "%" + p;
				}
			});
		};
	}
};
