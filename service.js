var http = require('http');
var url = require('url');
var fs = require('fs');
var util = require('util');

var fileType = require('./fileType').types;
var path = require('path');
var child_process = require("child_process");
var os = require('os');
  


var CNServer = {
	opations:JSON.parse(fs.readFileSync('config.json')),
	init: function() {
		var _this=this;
		var port=_this.opations.port || 8080;
		this.creatService(port);
		this.opations.autoOpenBrowser ? (this.openWindow(port)) : "";

	},
	getHostIP: function() {
		var IPv4, hostName;
		hostName = os.hostname();
		var ifaces = os.networkInterfaces();
		var ip = [];
		for (var x in ifaces) {

			for (var y in ifaces[x]) {
				var object = ifaces[x][y];
				if (object["family"] === this.opations.ipType) {
					ip.push(object.address); 
				}
			}

		}
		var json = {
			ip: ip,
			host: hostName,
			system:os.type(),
			release:os.release(),
			port: this.opations.port,
			index: this.opations.indexHTML
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

		if (process.platform == 'win32') {

			cmd = 'start "%ProgramFiles%\Internet Explorer\iexplore.exe"';

		} else if (process.platform == 'linux') {

			cmd = 'xdg-open';

		} else if (process.platform == 'darwin') {

			cmd = 'open';

		}
		var pc = _this.getHostIP();

		var location = "http://" + pc.ip[0] + ":" + port + "/" + (this.opations.index ? this.opations.indexHTML : this.opations.rootHTML);
		child_process.exec(cmd + ' "' + location + '"');

		user = "----- [" + pc.host + "]["+ pc.system+"]["+pc.release+"] [" + _this.formatDate(new Date()) + "]访问 ----\n";

		_this.appendLog(user);

	},
	getPath: function(request, response) {
		var pathname = url.parse(request.url).pathname;
		var realPath = path.join(this.opations.root, pathname);

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
		if (_this.opations.resetLog) {
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
	setLoadResources: function(request, response) {
		var _this = this,
			path = _this.getPath(request, response);
		var message = path.realPath + "---------- [" + ( _this.formatDate(new Date() ) ) + "]  \n";
		return message;
	},
	//时间格式format
	formatDate:function(date){
		var arr=["00","01","02","03","04","05","06","07","08","09"];
		var D=date.getDate() ,
			M=date.getMonth()+1,
			Y=date.getFullYear(),
			h=date.getHours(),
			m=date.getMinutes(),
			s=date.getSeconds();
		 
		return   Y+"-"+ (arr[M]||M) + "-"+(arr[D]||D)+" "+
				 (arr[h]||h)+":"+(arr[m]||m)+":"+(arr[s]||s);
	},
	page404: function(req, res, path) {
		res.writeHead(404, {
			'Content-Type': 'text/plain'
		});
		var error=http.STATUS_CODES[404]
		res.write("<!doctype html> \n");
		res.write("<title>404 "+error+"</title> \n");
		res.write("<h1>"+error+"</h1> \n");
		res.write("<p>not found " + path + "</p>");
		res.end();

	},
	page500: function(req, res, err) {
		res.writeHead(500, {
			'Content-Type': 'text/plain'
		});
		var error=http.STATUS_CODES[500];
		res.write("<!doctype html> \n");
		res.write("<title>500 "+error+"</title> \n");
		res.write("<h1>"+error+"</h1> \n");
		res.write("<p>" + util.inspect(err) + "</p>");
		res.end();
	},
	creatService: function(port) {
		var _this = this;
		_this.resetLog();
		 

		var server = http.createServer(function(req, res) {

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
							_this.opations.resourcesLog ? (_this.setLog(req, res)) : "";

						}
					});

				}
			});
			 

		}).listen(port, function() {
			console.log("目前服务器版本为v1.0,如有问题请自行解决");
			console.log("Server runing at port: " + port);
		}) ;


	}
};
CNServer.init();