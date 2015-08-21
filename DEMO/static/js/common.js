/* 通用方法合集
 * 
 */
if (fs) {
	console.log("fs已经加载")
} else {
	var fs = require('fs');

}

var common = {
	log: {
		set: function(file, message) {

			fs.appendFile(file, message, function(err) {
				if (err) {
					throw err;
				}
			});

		},
		reset: function(file, message) {
			fs.writeFile(file, message, function(err) {
				if (err) {
					throw err;
				}
			});
		}
	},
	getJSON: function(file) {
		return JSON.parse(fs.readFileSync(file))
	},
	//判断文件是否存在
	exists: function(obj) {
		fs.exists(obj.path, function(exists) {
			if (!exists) {
				obj.error(exists)
			} else {
				obj.success(exists);
			}
			obj.callback(exists);
		});
	},
	//读取文件
	readFile: function(obj) {
		fs.readFile(obj.path, obj.encode, function(err, file) {
			obj.callback(err, file);
		});
	},
	//格式化日期
	formatDate: function(date) {
		var arr = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09"];
		var D = date.getDate(),
			M = date.getMonth() + 1,
			Y = date.getFullYear(),
			h = date.getHours(),
			m = date.getMinutes(),
			s = date.getSeconds();

		return Y + "-" + (arr[M] || M) + "-" + (arr[D] || D) + " " +
			(arr[h] || h) + ":" + (arr[m] || m) + ":" + (arr[s] || s);
	},
	//数据格式化
	formatData: function(obj, type) {
		var _this = this,
			data = decodeURI(obj.toString()); 
		if (type == "json") { 
			data = _this.dataToObj(data);
		} 
		return data;
	},
	dataToObj: function(url) {
		var obj = {};
		var keyvalue = [];
		var key = "",
			value = "";

		var paraString = url.substring(0, url.length).split("&");
		for (var i in paraString) {
			keyvalue = paraString[i].split("=");
			key = keyvalue[0];
			value = keyvalue[1];
			obj[key] = value;
		}
		return JSON.stringify(obj);
	}
}

module.exports = common;