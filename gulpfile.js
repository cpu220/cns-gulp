const gulp = require('gulp'),
	shell = require('gulp-shell'),
	gulpif = require('gulp-if'),
    minimist = require('minimist'),
	connect = require('gulp-connect');
/*配置参数*/
const url = require('url'),
	less = require('gulp-less'),
	$ = require('gulp-load-plugins');

const config = require("./config.json");// 配置项
const memory = require("./app/memory"); // 内存监测

// const cf = require('./app/createFile');
// const ios = require('./app/ios');

const getFile = require('./app/getFile');



const CNServer = {
	opation: config,
	init: function () {

		this.connectServer();
		this.onTask();
	},
	//连接服务器
	connectServer: function () {
		const _this = this;
		gulp.task('connect',  (req, res) =>{
			connect.server(_this.opation);
			if(config.memoryListen){
				memory.init();
			}
		});
	},
	onTask: function () {
		var root = `./${ config.html.root}/**/*.*`;

		gulp.task('file', function () {
			gulp.src(root)
				.pipe(connect.reload());
		});

		gulp.task('watch', function () {
			gulp.watch([root+'/htdocs'], ['file']);
		});
		gulp.task('default', ['connect', 'watch']);

		gulp.task('path',shell.task('node app/path'));
	}
};

CNServer.init();

// todo 文件创建
// gulp.task('cf',function(){
// 	cf.init();
// });


/*todo 以下代码为临时代码*/

gulp.task('es6',function(){
	gulp.src(['src/*/*/*/js']).pipe($.plumber()).pipe($.babel({
		presets:['es2015']
	})).pipe(gulp.dest('demo/htdocs/'));
});

gulp.task('less',function(){
	gulp.src(['src/*/*/*.less']).pipe(less()).pipe(gulp.dest('demo/htdocs/'));
});

gulp.task('build',['less','es6'],function(){
	gulp.src(['./src/*/*.html']).pipe(gulp.dest('demo/htdocs/'));
});



gulp.task('b',function(){
	const A = new getFile('demo','html');

	A.getResult({
	  callback: function(arr){
	    console.log(arr)
	  }
	});
});
