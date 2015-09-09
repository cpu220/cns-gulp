
#CNS 
### v0.10.0 
基于node的service，用于前端h5快速开发，调试用。目前为第一版<br />
至于为毛要叫CNS（ChenPower`s node-service） 



##使用
* 使用前需要先判断是否已安装gulp

* Mac
	
		$ node cns 
* windows
	1. [node官网](https://nodejs.org/) 下载安装node
	2. 安装好后直接双击**cns.bat**
	3. 确保手机与pc在同一网络后，扫描屏幕出现的二维码

## 目录结构 
 <span style="color:#f4333c"">注意</span>: 此文件树为v0.10.0以前版本，之后会大幅度变更



	├── DEMO //web总目录
	│   ├── htdocs //demo存放目录
	│   │   ├── card //demo案例1
	│   │   │   ├── 123.jpg
	│   │   │   ├── 33.jpg
	│   │   │   ├── card.js
	│   │   │   └── index.html
	│   │   └── index.html //默认h5案例页面
	│   ├── ip.json
	│   ├── root.html
	│   ├── static //框架css、js引入.（由于github稳定问题，所依赖的js更改为本地。不另设选择框架选项）
	│   │   ├── css
	│   │   │   ├── common.css // 全局css框架文件 
	│   │   │   ├── iconfont.eot 
	│   │   │   ├── iconfont.svg
	│   │   │   ├── iconfont.ttf
	│   │   │   ├── iconfont.woff
	│   │   │   └── root.css //root扫码页面对应的css文件，不建议修改
	│   │   ├── jQuery
	│   │   │   └── jquery-1.9.1.js
	│   │   ├── js
	│   │   │   ├── common-cns.js // cns所依赖的通用方法
	│   │   │   ├── qrcode.js // 二维码生成
	│   │   │   └── root.js // root依赖的js文件
	│   │   └── swiper
	│   │       ├── swiper.css
	│   │       ├── swiper.js
	│   │       ├── swiper.min.css
	│   │       └── swiper.min.js
	│   └── uisvr //对应 htdocs页面js、css地址存放
	│       ├── css 
	│       │   └── index.css 
	│       └── js
	│           └── index.js
	├── README.md 
	├── Staticfile
	├── cns.js //启动文件
	├── config.json //cns全局配置文件
	├── log.txt //服务器日志
	├── CNS.bat // 对应windows的启动文件
	└── servicer.js //CNS服务器对应代码
 

##config.json
 CNS的动态配置文件，<span style="color:#f4333c"">注意</span>:每次修改需要重启才能生效。
   
| 参数 | 类型 |默认值| 说明 |
| ------------- |:-------------:| :----------:| -----:|
| indexHTML     | {Object string} | "htdocs/index.html"|扫码后进入的页面 |
| rootHTML |{Object string} | "root.html"|扫码页面地址|
| index|{Object bool}|false|是否直接打开目标页面，跳过root页面|
|root|{Object string}|"DEMO"|自定义项目根目录|
|version|{Object string} |0.10.0|CNS版本号|
|hostName|{Object boolean}|true|是否已ip为地址而不是localhost|
|ipType|{Object string}| "IPv4"|ip类型
|port|{Object Int}|8080|自定义端口| 
|resourcesLog|{Object boolean}|true|日志是否记录资源加载项|
|resetLog|{Object boolean}|true|每次启动CNS是否重置log (暂停)|
|request|{Object boolean}|true|是否监听web数据请求(暂停)|
|dateType|{Object string}|"json"|日志内对网络请求的记录格式：json、string(暂停)|
|judgeFileType|{Object array}|["htm", "html", "php", "asp", "aspx"]|允许访问的文件格式(暂停)|
|suffix|{Object object}| *详情见代码*|资源加载文件类型字典表(暂停)|
|autoOpenBrowser|{Object object} |true|是否自动打开浏览器|
|livereload|{Object boolean}|false|所见即所得</br>（该功能正在拼命开发中，请期待0.10.0版本)|


##ip.json
用于记录服务器运行信息,生成对应二维码
 

##GIT
[传送门](https://coding.net/u/belial/p/gulp-cns/git) 

