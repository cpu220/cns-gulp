var http = require('http');
var os = require('os');
var url = require('url');
var util = require('util');
var path = require('path');
var stream = require('stream');
var child_process = require("child_process"); 

/*通用方法合集*/
var common = require("./DEMO/static/js/common-cns.js");
/*配置参数*/
var config = require("./config.json");

var CNServer = {
	opations: config,
	init: function() {
		var _this = this;
		var port = _this.opations.port || 8080;
		this.creatService(port);
		this.opations.autoOpenBrowser ? (this.openWindow(port)) : "";

	},
	/*获取当前ip，根据协议生成对应的服务器可访问地址*/
	getHostIP: function() {
		var hostName = os.hostname();
		var ifaces = os.networkInterfaces();
		var ip = [];
		for (var x in ifaces) {

			for (var y in ifaces[x]) {
				var object = ifaces[x][y];
				if (object["family"] === this.opations.service.ipType) {
					ip.push(object.address);
				}
			}

		}
		var json = {
			ip: ip,
			host: this.opations.service.hostName ? hostName : "",
			system: os.type(),
			release: os.release(),
			port: this.opations.service.port,
			index: this.opations.html.indexHTML
		};
		common.log.reset("./DEMO/ip.json", JSON.stringify(json)); 
		return json
	},
	/*根据操作系统打开浏览器*/
	openWindow: function(port) {
		var _this = this;
		var html = this.opations.html;
		if (process.platform == 'win32') {

			cmd = 'start "%ProgramFiles%\Internet Explorer\iexplore.exe"';

		} else if (process.platform == 'linux') {

			cmd = 'xdg-open';

		} else if (process.platform == 'darwin') {

			cmd = 'open';

		}
		var pc = _this.getHostIP();

		var location = "http://" + pc.ip[0] + ":" + port + "/" + (html.index ? html.indexHTML : html.rootHTML);
		child_process.exec(cmd + ' "' + location + '"');

		var user = "----- [" + pc.host + "][" + pc.system + "][" + pc.release + "] [" + common.formatDate(new Date()) + "] [服务器初始化结束] ----\n";

		_this.appendLog(user);

	},
	/*获取资源路径*/
	getPath: function(request, response) {
		var pathname = url.parse(request.url).pathname;
		var realPath = path.join(this.opations.html.root, pathname);

		var ext = path.extname(realPath);
		ext = ext ? ext.slice(1) : 'unknown';

		return {
			pathname: pathname,
			realPath: realPath,
			ext: ext
		}
	},
	/*重置日志*/
	resetLog: function() {
		var _this = this;
		if (_this.opations.log.resetLog) {
			common.log.reset("log.txt", "");

		} else {
			var line = "--------------[服务器初始化结束]-------------- \n";
			_this.appendLog(line);
		}

	},
	/*启动设置日志head*/
	setLog: function(req, res) {
		var _this = this,
			resources = _this.setLoadResources(req, res);
		var message = resources;
		_this.appendLog(message);


	},
	/*插入日志*/
	appendLog: function(message) {
		common.log.set("log.txt", message, {
			encoding: 'utf-8',
			bufferSize: 11
		});

	},
	//读取资源
	setLoadResources: function(req, res) {

		var visitorIP = req.socket.remoteAddress,
			hostIP = req.socket.address().address;
		var _this = this,
			path = _this.getPath(req, res);
		// var pc = _this.getHostIP();

		var ip = req.socket.address(),
			url = path.realPath,
			message = "";
		if (_this.judgeFileType(url)) {
			message += "-----------加载新连接[" + hostIP + "]------------- \n";
		}
		message += "[" + visitorIP + "][" + (common.formatDate(new Date())) + "] [" + url + "]    \n";


		return message;
	},
	//判断访问资源文件类型
	judgeFileType: function(url) {
		var _this = this,
			reg = /\.[^\.]+$/,
			type = _this.opations.doctypes;
		var file = reg.exec(url)[0];
		var status = false;
		for (var i = 0; i < type.length; i++) {
			if (file.indexOf(type[0]) >= 0) {
				status = true;
			}
		}
		return status;

	},
	/*默认404页面*/
	page404: function(req, res, path) {
		res.writeHead(404, {
			'Content-Type': 'text/plain'
		});
		var error = http.STATUS_CODES[404]
		res.write("<!doctype html> \n");
		res.write("<title>404 " + error + "</title> \n");
		res.write("<h1>" + error + "</h1> \n");
		res.write("<p>not found " + path + "</p>");
		res.end();

	},
	/*默认错误500页面*/
	page500: function(req, res, err) {
		res.writeHead(500, {
			'Content-Type': 'text/plain'
		});
		var error = http.STATUS_CODES[500];
		res.write("<!doctype html> \n");
		res.write("<title>500 " + error + "</title> \n");
		res.write("<h1>" + error + "</h1> \n");
		res.write("<p>" + util.inspect(err) + "</p>");
		res.end();
	},
	/*创建服务器*/
	creatService: function(port) {
		var _this = this;
		_this.resetLog();


		_this.server = http.createServer(function(req, res) {

			var path = _this.getPath(req, res);
			common.exists({
				path: path.realPath,
				success: function() {
					common.readFile({
						path: path.realPath,
						encode: "binary",
						callback: function(err, file) {
							if (err) {
								_this.page500(req, res, err)
							} else {
								var contentType = _this.opations.suffix[path.ext] || "text/plain";
								res.writeHead(200, {
									'Content-Type': contentType
								});
								res.write(file, "binary");



								_this.opations.log.request ? (_this.onData(req)) : "";
								res.end();
								_this.opations.log.resourcesLog ? (_this.setLog(req, res)) : "";

							}
						}
					})
				},
				error: function() {
					_this.page404(req, res, path.pathname);
				},
				callback: function(exists) {
					/*读取文件结束*/
				}
			});
		});
		_this.server.listen(port, function() {
			console.log("\nCurrent version: " + _this.opations.version);
			console.log("Server runing at port: " + port + " \n");

		});


	},
	/*监听数据传输*/
	onData: function(req) {
		var _this = this;
		// var dataArr = [], len = 0, data;
		var visitorIP = req.socket.remoteAddress,
			hostIP = req.socket.address().address;

		req.on("data", function(data) {
			var d = common.formatData(data, _this.opations.log.dateType); 
			var text = "[" + (common.formatDate(new Date())) + "]["+ visitorIP +"][Form Date]: " + d;
			var log = "--------[start 接受数据]--------\n" + text + "\n--------[end 接收数据]--------	\n";
			_this.appendLog(log);
		});

		req.on("request", function(data) {
			console.log(data);

		}); 
	}
};
module.exports = CNServer;
/*保留位*/