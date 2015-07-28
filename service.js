var http = require('http');
// var net = require('net');

var url = require('url');
var fs = require('fs');
var util = require('util');

var fileType = require('./fileType').types;
var path = require('path');
var child_process = require("child_process");
var os = require('os');



var CNServer = {
	opations: JSON.parse(fs.readFileSync('config.json')),

	init: function() {
		var _this = this;
		var port = _this.opations.port || 8080;
		this.creatService(port);
		this.opations.autoOpenBrowser ? (this.openWindow(port)) : "";

	},
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

		fs.writeFile("./DEMO/ip.json", JSON.stringify(json), function(err) {
			if (err) {
				throw err;
			}
		});
		return json
	},
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

		var user = "----- [" + pc.host + "][" + pc.system + "][" + pc.release + "] [" + _this.formatDate(new Date()) + "] [服务器初始化结束] ----\n";

		_this.appendLog(user);

	},
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
	resetLog: function() {
		var _this = this;
		if (_this.opations.log.resetLog) {
			fs.writeFile("log.txt", "", function(err) {
				if (err) {
					throw err;
				}
			});
		} else {
			var line = "--------------[服务器初始化结束]-------------- \n";
			_this.appendLog(line);
		}

	},
	setLog: function(req, res) {
		var _this = this,
			resources = _this.setLoadResources(req, res);
		var message = resources;

		_this.appendLog(message);
	},
	appendLog: function(message) {
		fs.appendFile("log.txt", message, function(err) {
			if (err) {
				throw err;
			}
		});
	},
	//读取资源
	setLoadResources: function(req, res) {

		var _this = this,
			path = _this.getPath(req, res);
		// var pc = _this.getHostIP();
		var ip= req.socket.address(),
			url=path.realPath,
			message="";
		if(_this.judgeFileType(url) ){
			message +="-----------加载新连接------------- \n";
		}
		 message += "["+ip.address+"] ["+ url + "] ---------- [" + (_this.formatDate(new Date())) + "]  \n";
		return message;
	},
	//判断访问资源文件类型
	judgeFileType:function(url){
		var reg=/\.[^\.]+$/;
		var type=["html","html","php","asp","aspx"];
		var file= reg.exec(url)[0];
		var status=false;
		for(var i=0;i<type.length;i++){
			if(file.indexOf(type[0])  >=0 ){
				status=true;
			}
		}
		return status;
		  
	},
	//时间格式format
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
	creatService: function(port) {
		var _this = this;
		_this.resetLog();


		_this.server = http.createServer(function(req, res) {

			var path = _this.getPath(req, res);
			fs.exists(path.realPath, function(exists) {
				if (!exists) {
					_this.page404(req, res, path.pathname);

				} else {

					fs.readFile(path.realPath, "binary", function(err, file) {
						if (err) {
							_this.page500(req, res, err)
						} else {
							var contentType = fileType[path.ext] || "text/plain";
							res.writeHead(200, {
								'Content-Type': contentType
							});
							res.write(file, "binary");
							res.end();
							_this.opations.log.resourcesLog ? (_this.setLog(req, res)) : "";

						}
					});

				}
			});


		});
		_this.server.listen(port, function() {
			console.log("\nCurrent version: "+_this.opations.version);
			console.log("Server runing at port: " + port +" \n");

		});
		  

	}
};
CNServer.init();