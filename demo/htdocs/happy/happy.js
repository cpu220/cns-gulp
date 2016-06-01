 // $(document).ready(function() {

 	var page = {
 		init: function(obj) {
 			// $(".J-cake-content").hide();
 			this.op = obj;
 			this.direction = ["left", "right"];
 			this.setCake();
 		},
 		//创建蛋糕DOM并插入容器内
 		creatCake: function() {
 			var _this = this,
 				str = '',
 				arr, animateJson;
 			direction = _this.direction[_this.randomArr() % 2];

 			str = '<div class="J-cake am-' + direction + '" style="' +
 				direction + ':' + _this.randomXY("x") + 'px;' +
 				'-webkit-animation-duration:' + (_this.op.time / 1000) + 's;' +
 				'"></div>';
 			var m = $(str);

 			$(_this.op.elem).append(m);

 			var length = Math.floor(Math.random() * 90) + "%";


 			animateJson = "[{'" + direction + "':'" + length + "'}]";

 			m.animate(eval('(' + animateJson + ')')[0], _this.op.time);


 			setTimeout(function() {
 				m.remove();
 			}, _this.op.time);
 		},
 		//设置出现在屏幕内的蛋糕数
 		setCake: function() {
 			var _this = this,
 				count = 0;

 			var timer = setInterval(function() {
 				count++;
 				_this.creatCake();  
 				if (count === (_this.op.cakesNum-1) )  {
 					clearInterval(timer);
 					setTimeout(function() {
 						//掉落大蛋糕
 						cakeAnimate.init({
 							nextTime: 700,
 							delyTime: 1000
 						});
 					}, 3000)
 				}
 				 
 			}, _this.op.nextTimes);

 			// $(_this.op.elem).html(_this.creatCake());

 		},
 		//随机XY坐标
 		randomXY: function(arr) {
 			var _this = this,
 				num,
 				max,
 				obj = $(_this.op.elem);
 			if (arr === "x") {
 				max = obj.width();
 			} else if (arr === "y") {
 				max = obj.height();
 			}

 			num = Math.floor(Math.random() * (max - 20));
 			return num;
 		},
 		//随机方向
 		randomArr: function() {
 			var num = Math.floor(Math.random() * 2);
 			return num
 		}
 	}
 	



 	//掉落大蛋糕
 	var cakeAnimate = {
 		init: function(obj) {
 			this.controllCake(true);
 			this.op = obj;
 			this.cakeLage();
 		},
 		controllCake: function(flg) {
 			var elem = $(".J-cake-content");

 			if (flg) {
 				elem.removeClass("fn-hide");
 			} else {
 				elem.addClass("fn-hide");
 			}
 		},
 		cakeLage: function() {
 			var _this = this,
 				cake = ".happy";

 			_this.setAnimate({
 				elem: cake,
 				flg: true,
 				time: (_this.op.delyTime / 1000),
 				am: "dropContent"
 			});
 			setTimeout(function() {
 				//蛋糕掉落后清除className
 				// _this.setAnimate({
 				// 	elem: cake,
 				// 	flg: false,
 				// 	am: "dropContent"
 				// });
 				//蛋糕掉落后的弹性
 				_this.setAnimate({
 					elem: ".J-cake-lage",
 					flg: true,
 					am: "elasticity",
 					time: (_this.op.delyTime / 1000)
 				});
 				//happy动画
 				_this.onHappy()

 			}, _this.op.nextTime);
 		},
 		onHappy: function() {
 			//happy 掉落
 			var _this = this,
 				happy = ".J-cake-msg";

 			$(".J-cake-msg").css({
 				"visibility": "visible"
 			});
 			_this.setAnimate({
 				elem: happy,
 				flg: true,
 				time: (_this.op.nextTime / 1000),
 				am: "dropHappy"
 			});

 			setTimeout(function() {
 				//happy掉落后的弹性清除className
 				// _this.setAnimate({
 				// 	elem: ".J-cake-msg",
 				// 	flg: false,
 				// 	am: "dropHappy"
 				// });
 				//happy掉落后弹性
 				_this.setAnimate({
 					elem: ".J-cake-msg",
 					flg: true,
 					am: "elasticity",
 					time: (_this.op.nextTime / 1000)
 				});

 				_this.onLine();

 			}, _this.op.nextTime - 100);
 		},
 		onLine: function() {
 			var _this = this;
 			setTimeout(function() {
 				$(".line").removeClass("fn-hide");
 				_this.setAnimate({
 					elem: ".line",
 					flg: true,
 					time: (_this.op.nextTime / 1000),
 					am: "am-line"
 				});
 			}, _this.op.nextTime)

 		},
 		setAnimate: function(obj) {
 			var elem = $(obj.elem);
 			if (obj.flg) {
 				elem.addClass(obj.am).css({
 					"-webkit-animation-duration": obj.time + "s"
 				});
 			} else {
 				elem.removeClass(obj.am);
 			}
 		}
 	};
 	// cakeAnimate.init({
 	// 	nextTime:700,
 	// 	delyTime:1000
 	// });


 // });