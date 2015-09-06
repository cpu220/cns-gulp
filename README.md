#CNS 
### v0.0.9

基于node的service，用于前端h5快速开发，调试用。目前为第一版

##使用
* Mac
	
		$ node cns 
* windows
	1. [node官网](https://nodejs.org/) 下载安装node
	2. 安装好后直接双击**cns.bat**
	3. 确保手机与pc在同一网络后，扫描屏幕出现的二维码

## 目录结构

 
	└─DEMO //web总目录
	    ├─htdocs //demo存放目录
	    │  └─card //demo案例。
	    ├─static //框架css、js引入
	    │  ├─css
	    │  ├─jQuery
	    │  ├─js
	    │  └─swiper
	    └─uisvr //对应 htdocs页面js、css地址存放
	        ├─css
	        └─js
	        

##config.json
 CNS的动态配置文件，**注意:** 每次修改需要重启才能生效。
   
| 参数 | 类型 |默认值| 说明 |
| ------------- |:-------------:| :----------:| -----:|
| indexHTML     | {Object string} | "htdocs/index.html"|扫码后进入的页面 |
| rootHTML |{Object string} | "root.html"|扫码页面地址 |
| index|{Object bool}|false|是否直接打开目标页面，跳过root页面|
|root|{Object string}|"DEMO"|自定义项目根目录|
|version|{Object string} |0.0.9|CNS版本号|
|hostName|{Object boolean}|true|是否已ip为地址而不是localhost|
|ipType|{Object string}| "IPv4"|ip类型
|port|{Object Int}|8080|自定义端口|
|sync|{Object boolean}|false|所见即所得</br>（该功能正在拼命开发中，请期待0.10.0版本)|
|resourcesLog|{Object boolean}|true|日志是否记录资源加载项|
|resetLog|{Object boolean}|true|每次启动CNS是否重置log|
|request|{Object boolean}|true|是否监听web数据请求|
|dateType|{Object string}|"json"|日志内对网络请求的记录格式：json、string|
|judgeFileType|{Object array}|["htm", "html", "php", "asp", "aspx"]|允许访问的文件格式|
|suffix|{Object object}||资源加载文件类型列表|
|autoOpenBrowser|{Object object} |true|是否自动打开浏览器|


##ip.json
用于记录服务器运行信息,生成对应二维码
 

##GIT
[传送门](https://coding.net/u/belial/p/CNS/git)

