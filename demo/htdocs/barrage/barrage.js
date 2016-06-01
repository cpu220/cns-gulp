 // $(document).ready(function() {

 	var page = {

 		init: function(opation) {
 			this.elem = $(opation.elem);
 			this.times = opation.times;
 			this.Kaleidoscope = opation.Kaleidoscope;
 			this.data = opation.data;
 			this.nextTimes = opation.nextTimes;


 			this.color = opation.color || ["00aaee", "00eea8", "eeeb00", "ee9200", "ee1c00", "9d00ee", "ee009d", "000000"];

 			this.onEvent(opation);
 		},
 		onEvent: function(opt) {
 			var _this = this;
 			_this.setDarrage(opt.data);
 		},
 		//设置弹幕
 		setDarrage: function(data) {
 			var _this = this;
 			for (var x = 0; x < data.length; x++) {

 				(function(i) {
 					setTimeout(function() {
 						_this.createDarrage(data, i);
 					}, (i + 1) * _this.nextTimes)
 				})(x);
 			}
 		},

 		//创建弹幕动作
 		createDarrage: function(data, i) {

 			var _this = this,
 				str = _this.getBarrageDOM(data[i]);
 			var m = $(str)
 			_this.elem.find(".J-content").append(m);

 			setTimeout(function() {
 				$(m[0]).removeClass("start").addClass("end");
 			}, _this.times);
 		},
 		// 生成弹幕DOM
 		getBarrageDOM: function(data) {
 			var _this = this,
 				top = _this.getRandomTop(),
 				color = _this.Kaleidoscope ? _this.getRandomColor() : "000000";
 			var dom = "<span class='barrage-msg start' style='" +

 				"top:" + top + "px;" +
 				" -webkit-animation-duration:" + (_this.times / 1000) + "s;" +
 				"color:#" + color + "" +

 				"'>" + data.name + "</span>";
 			return dom;
 		},
 		// 随机高度获取
 		getRandomTop: function() {
 			var _this = this;
 			var h = _this.elem.height();
 			return Math.floor(Math.random() * (h - 20));
 		},
 		// 字幕随机颜色
 		getRandomColor: function() {
 			var _this = this;
 			var num = Math.floor(Math.random() * _this.color.length);
 			return _this.color[num];
 		}

 	}
 	page.init({
 		elem: "#a1",
 		times: 10000,
 		Kaleidoscope: true,
 		nextTimes: 1000,
 		// color: ["00aaee","000000"],
 		data: [{
 			name: "哇哈哈哈",
 			code: "1",
 			time: 1
 		}, {
 			name: "蛇精病啊(╯‵□′)╯︵┻━┻",
 			code: "2",
 			time: 1
 		}, {
 			name: "什么鬼！！！！！",
 			code: "3",
 			time: 1
 		}, {
 			name: "欧皓辰俺稀罕你！！！",
 			code: "4",
 			time: 1
 		}, {
 			name: "黄色预警!黄色预警!",
 			code: "5",
 			time: 1
 		}, {
 			name: "进度条君坚持住！",
 			code: "6",
 			time: 1
 		}, {
 			name: "6666666666666666",
 			code: "7",
 			time: 1
 		}, {
 			name: "这里是弹幕这里是弹幕这里是弹幕这里是弹幕这里是弹幕",
 			code: "8",
 			time: 1
 		}, {
 			name: "寡人要让所有人知道，这个弹幕，被寡人承包了！",
 			code: "9",
 			time: 1
 		}, {
 			name: "请求弹幕支援",
 			code: "10",
 			time: 1
 		}]
 	});


 // });