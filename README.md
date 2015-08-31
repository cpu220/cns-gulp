v0.0.9
#CNS

基于node的service，用于前端h5快速开发，调试用。目前为第一版

##config.json
   
| 参数 | 类型 |默认值| 说明 |
| ------------- |:-------------:| :----------:| -----:|
| indexHTML     | {Object String} | "htdocs/index.html"|扫码后进入的页面 |
| rootHTML |{Object string} | "root.html"|扫码页面地址 |
| index|{Object bool}|false|是否直接打开目标页面，跳过root页面|
|root|{Object string}|"DEMO"|自定义项目根目录|
|version|{Object string} |0.0.9|CNS版本号|
|hostName|{Object bool}|true|是否已ip为地址而不是localhost|
|ipType|{Object string}| "IPv4"|ip类型
|port|{Object Int}|8080|自定义端口|
|sync|{Object bool}|false|所见即所得</br>（该功能正在拼命开发中，请期待0.10.0版本)|
|resourcesLog|{Object bool}|true|日志是否记录资源加载项|
|resetLog|{Object bool}|true|每次启动CNS是否重置log|
|request|{Object bool}|true|是否监听web数据请求|
|dateType|{Object string}|"json"|日志内对网络请求的记录格式：json、string|
|judgeFileType|{Object Array}|["htm", "html", "php", "asp", "aspx"]|允许访问的文件格式|
|suffix|{Object object}||资源加载文件类型列表|
|autoOpenBrowser|{Object object} |true|是否自动打开浏览器|

##GIT
	[传送门](https://coding.net/u/belial/p/CNS/git)

