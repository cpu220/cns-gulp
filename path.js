const common = require('./common-cns.js');
const msg = require('./colorMessage.js');
const fileArray = [
	'gulp-connect'
];

for(var i of fileArray){
	(function(i){
		const fileName = i;
		common.readFile({
			path : `path/${fileArray}.js`,
			encode:'utf8',
			callback:function(err,file){
				var indexText = file;
				common.log.reset(`node_modules/${fileName}/index.js`,indexText);
				msg.info(`${fileName}已修正\n`);
			}
		});
	})(i);
}
