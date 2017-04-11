const inquirer = require('inquirer');
const common = require('./common-cns.js');
const gulp = require('gulp');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const msg = require('./colorMessage');

const qa=[{
    type:'input',
    name:'root',
    messgae:'enter root',
    default:function(){return 'test';}
},{
    type:'input',
    name:'page',
    message:'enter page\'s name',
    default:function(){
        return 'index';
    }
},{
    type:'checkox',
    message:'choose frame',
    name:'frame',
    choices:[
        new inquirer.Separator(' = The javascript\'sframe ='),
        {name:'jQuery'},{name:'zepto'},{name:'swiper'}
    ]
}];

const frame = [{
    name:'jQuery',
    js:'jQuery/jquery-1.9.1.js'
},{
    name:'swiper',
    js:'swiper/swiper.js',
    css:'swiper/swiper.css'
},{
    name:'zepto',
    js:'zepto/zepto.js'
}];



const action = {
	init:function(){
		this.doCreate();
	},
	getName:function(callback){
		inquirer.prompt(qa).then(function(answers){
			console.log(answers);
			callback(answers);
		});
	},
	doCreate:function(){
		const _this = this;
		_this.getName(function(json){
			_this.createResource(json);
		})
	},
	createHTML:function(json){
		const _this = this;
		const includeStr = _this.createInclude(json);
		gulp.src(['./template/index.html'])
			.pipe(rename(function(path){
				path.basename = json.page;
			}))
			.pipe(replace('index',json.root+'-'+json.page))
			.pipe(replace('<!--include-->',includeStr))
			.pipe(gulp.dest('./src/'+json.root)).on('end',function(){
				msg.info(`\n 创建 [${json.root}/${json.page}] 完毕\n`);
			});
	},
	// 创建资源 *.js / *.css
	createResource(json){
		const _this=this;
		gulp.src(['./template/*/*'])
			.pipe(rename(function(path){
				path.basename = json.root + '-'+json.page;
			}))
			.pipe(gulp.dest('./src/json.root')).on('end',function(){
				_this.createHTML(json);//资源获取完毕后再创建html
			});
	},
	// 根据json创建引入的script文件
	createInclude:function(json){
		const _this=this,
			list = json.frame;
		var resouse=[];
		for(var i = 0;i<list.length;i++){
			resouse.push( _this.findResource(frame,list[i]));
		}
		return resouse.join('\n');

	},
	findResource:function(list,name){
		var result = [];
		for(var i =0;i<list.length;i++){
			if(list[i].hasOwnProperty('js')){
				result.push(`<script src="../../static/${list[i].js}"></script>`);
			}
			if(list[i].hasOwnProperty('css')){
				result.push(`<link rel="stylesheet" href="../../static/${list[i].css}"/> `);
			}
			break;
		}
		if(result.length === 0){
			msg.error(`${name} 不在配置项中`);
			return '';
		}else{
			return result.join('\n');
		}
	}
};
action.init();



module.exports = action;
