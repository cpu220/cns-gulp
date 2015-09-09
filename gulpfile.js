var gulp = require('gulp'),
	connect = require('gulp-connect');
/*配置参数*/
var url = require('url');

var config = require("./config.json"); 


var CNServer = {
	opation: config,
	init: function () {

		this.connectServer();
		this.onTask();
	},
	//连接服务器
	connectServer: function () {
		var _this = this;
		gulp.task('connect', function (req, res) { 
			connect.server(_this.opation);
		});
	},
	onTask: function () {
		var root = "./" + config.html.root + "/**/*.*";

		gulp.task('html', function () {
			gulp.src(root)
				.pipe(connect.reload());
		});

		gulp.task('watch', function () {
			gulp.watch([root], ['html']);
		});
		gulp.task('default', ['connect', 'watch']);
	}
};

CNServer.init();