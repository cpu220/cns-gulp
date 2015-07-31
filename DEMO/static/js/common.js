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
	}
}

module.exports = common;