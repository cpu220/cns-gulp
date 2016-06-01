
var root={
	page:location.origin,
	css:"css!"+location.origin
};

require.config({
		// baseUrl:pageRoot+"/static",

		paths:{
			"jquery":root.page+"/static/jQuery/jquery-1.9.1",
			"swiper":root.page+"/static/swiper/swiper"
		},
		waitSeconds: 15,
		map:{
			"*":{
				'css': '../../css'
			}
		}

});

require([root.css+"/static/css/common"],function(){
	console.log("css load complate!")
})
