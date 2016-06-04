
var root={
	page:location.origin,
	css:"css!"+location.origin
};

require.config({
		// baseUrl:pageRoot+"/static",

		paths:{
			"jquery":root.page+"/static/jQuery/jquery-1.9.1",
			"swiper":root.page+"/static/swiper/swiper",
			"confirmbox":root.page+"/static/confirmbox/confirmbox",
			"qrCode":root.page+"/static/js/qrcode"
		},
		waitSeconds: 15,
		map:{
			"*":{
				'css': '../../css'
			}
		}

});

require([
	root.css+"/static/css/common"
],function(){
	console.log("css load complate!")
})
