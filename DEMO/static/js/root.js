$(document).ready(function() {
	var root = {
		init: function(fileName) {
			this.doAjax(fileName);
			
		},
		/* 获取本地动态生成的ip地址，用于手机端即时访问
		* return {object Object} 将ip.json获取后直接用于使用
		*/
		doAjax: function(fileName) {
			var _this = this;
			jQuery.ajax({
				type: "GET",
				url: fileName+".json",
				dataType: "json",
				success: function(data) {
					a = data;
					_this.creatDOM(data);
				},
				error: function(err) {
					console.log(err.responseText);
				}
			});
		},
		/* 创建跳转地址的DOM
		* {object Object} 跳转地址的对应参数
		*/
		creatDOM: function(json) {
			var _this = this,
				str = "";
			for (var i in json.ip) {
				var num=(parseInt(i) + 1),
					url="http://" + json.ip[i] + ":" + json.port + "/"+json.index;
				str += "<td><a data-id='a"+num+"' href='"+url+"' >地址" + num + " [" + json.ip[i] + " ]</a></td>"
				this.setQrCode({
					id:$("#qrcode div").eq(i)[0],
					url:url
				});
			}
			$("#address").append(str);

		},
		/* 生成二维码
		* {object Object} 二维码对象的信息
		*/
		setQrCode: function(object) {
			var qrcode = new QRCode(object.id, {
				width: 150, //设置宽高
				height: 150
			});
			qrcode.makeCode(object.url); 
		}
	};
	root.init("ip");

})