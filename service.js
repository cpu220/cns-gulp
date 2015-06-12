

var http = require('http');
var url = require('url');
var fs = require('fs');
var fileType = require('./fileType').types;
var path = require('path');
var child_process = require("child_process"); 
var os = require('os');

var opations=JSON.parse(fs.readFileSync('package.json'));



var service = {
	init: function(port) {
		this.creatService(port);
		opations.autoOpenBrowser?(this.openWindow(port) ):"";
		console.log("目前服务器版本为v1.0,如有问题请自行解决");
		console.log("Server runing at port: " + port + "."); 
	},
	getHostIP: function() {
		var IPv4, hostName;
		hostName = os.hostname();
		var ifaces = os.networkInterfaces(); 
		var ip=[];
		for(var x in ifaces){

			for(var  y in ifaces[x]){
				var object=ifaces[x][y];
				if(  object["family"] === opations.ipType){
					ip.push(object.address);
				}
			}
			  
		}
		var json={
			ip: ip,
			host: hostName,
			port:opations.port,
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
		
		var location = "http://" + pc.ip[0] + ":" + port + "/"+(opations.index?opations.indexHTML:opations.rootHTML);
		child_process.exec(cmd + ' "' + location + '"');

		user = "[" + pc.host + "] 访问 ["+ (new Date()) + "] \n";

		_this.appendLog(user);

	},
	getPath: function(request, response) {
		var pathname = url.parse(request.url).pathname;
		var realPath = path.join(opations.root, pathname);

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
		if (opations.resetLog) {
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
	setLog: function(request, response) {
		var _this = this,
			resources = _this.setLoadResources(request, response);
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
	setLoadResources: function(request, response) {
		var _this = this,
			path = _this.getPath(request, response);
		var message = "[" + (new Date()) + "]" + path.realPath + " [ 加载成功！] \n";
		return message;
	},
	creatService: function(port) {
		var _this = this;
		_this.resetLog();
		http.createServer(function(request, response) {

			var path = _this.getPath(request, response);
			fs.exists(path.realPath, function(exists) {
				if (!exists) {
					response.writeHead(404, {
						'Content-Type': 'text/plain'
					});

					response.write("This request URL " + path.pathname + " was not found on this server.");
					response.end();
				} else {

					fs.readFile(path.realPath, "binary", function(err, file) {
						if (err) {
							response.writeHead(500, {
								'Content-Type': 'text/plain'
							});
							response.end(err);
						} else {
							var contentType = fileType[path.ext] || "text/plain";
							response.writeHead(200, {
								'Content-Type': contentType
							});
							response.write(file, "binary");
							response.end();
							opations.resourcesLog?(  _this.setLog(request, response) ):"";

						}
					});
				}
			});

		}).listen(port);

	}
};
service.init(opations.port);