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
				url: fileName + ".json",
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
				var num = (parseInt(i) + 1),
					url = "http://" + json.ip[i] + ":" + json.port + "/" + json.index;
					 
				str += "<li data-num='" + num + "'>" +
					"<div class='qrcodeBox'  >" +
					"<div id='qrcode" + num + "' class='qrcodeIMG' data-url='"+url+"' ></div>" +
					"<div class='qrcode-title'><a href='" + url + "'>地址" + num + ":[" + json.ip[i] + "]</a></div>"+ 
					"</div></li>"; 

			}
			$("#qrcodeList").append(str);

			$(".qrcodeIMG").each(function(){
				_this.setQrCode({
					id: $(this)[0],
					url: $(this).data("url")
				});
			});
			 this.onQrcodeClick();
			 /*
			 	ToDo
			 	这里需要扩展下菊花
			 */
		},
		onQrcodeClick:function(){
			$(".qrcodeBox").on("click",function(){
				var url=$(this).find("a").attr("href");
				location.href=url;
			})
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