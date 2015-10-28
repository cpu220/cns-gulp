var confirmBox = function(define) {
	//默认参数
	var defaults = { 
		width: "520px",
		height: "230px",
		head: "confirmBox标题",
		state: "help",
		msgTitle: "这里是内容标题",
		msgContent: "这里是内容正文",
		confirmBtn: "确&nbsp;&nbsp;定", //确定按钮文案
		cancelBtn: "", //取消按钮文案，若为空，则默认为取消
		smartrackerOk: "", //确定按钮的埋点seed
		smartrackerCancel: "", //取消按钮的埋点seed
		beforeClose: function() {}, //关闭前的回调函数
		beforeOpen: function() {}, //展示前的回调函数
		afterOpen: function() {}, //展示后的回调函数
		/*以下为扩展参数*/
		autoClose: true, //点击确定后，是否自动关闭confirmBox.fasle->需要手动调用关闭接口方可关闭
		headSwitch: true, //标题栏开关
		confirmBtnSwitch: true, //确定按钮的开关
		cancelBtnSwitch: true, //取消按钮的开关
		animateCloseBtn: true

	};


	var iconState = {
			"help": "&#xe603;", //除help ，以下标识需要修正
			"warn": "&#xe607;",
			"error": "&#xe604;",
			"success": "&#xe606;"
		},
		pixel = ["width", "height", "countPaddingTop", "countPaddingRight", "countPaddingBottom", "countPaddingLeft"],
		callback = ["beforeClose", "beforeOpen", "afterOpen"],
		version = "1_0";

	var cb = {
		//检验参数
		verify: function(object) {
			for (var elem in object) {
				for (var obj in pixel) {
					if (elem === pixel[obj]) {
						object[elem] = parseInt(object[elem]) + "px";
					}
				}
				//正则校验回调函数是否被改为其他类型，如果有则修正为空函数
				 if (elem === callback[0] || elem === callback[1] || elem === callback[2]) {
					typeof(object[elem]) === "function" ? "" : object[elem] = function() {};
				}
			}

			var opations = jQuery.extend(defaults, object);
			return opations;
		},

		//根据参数 生成DOM
		creationDOM: function(options) {
			var innerHeight = parseInt(options.height),
				buttonHeight = 52,
				headHeight = 51;
			var buttonDOM = "",
				headDOM = "";

			if (options.confirmBtnSwitch || options.cancelBtnSwitch) {
				innerHeight -= buttonHeight;
				//按钮区 
				buttonDOM = this.buttonHTML(options);
			}
			if (options.headSwitch) {
				innerHeight -= headHeight;
				headDOM = this.headHTML(options)
			}
			//根据options的参数进行组装DOM  
			//遮罩层
			var maskLayerDOM = "<div class='confirmBox-mask'></div>";
			//confirm的head区

			//内容区域
			var innerDOM = this.innerHTML(options);
			var cbLength=$(".confirmBox").length;
			//整体DOM拼合	
			var HtmlDOM = maskLayerDOM +
				"<div class='confirmBox-border' style='width:" + options.width + ";min-height:" + options.height + ";'>" +
				"<div class='confirmBox-box'>" + headDOM +
				"<div class='confirmBox-innerbox' style='min-height:" + innerHeight + "px;'>" + innerDOM + "</div> " + buttonDOM +
				"</div> </div>";

			return "<div class='confirmBox cb-" + version + " cb-" + (++cbLength) + " '>" + HtmlDOM + "</div>";

		},
		headHTML: function(options) {
			var headDOM = "<span class='confirmBox-close " + (options.animateCloseBtn ? "animate-confirmBox-close" : "") + "'>×</span>" +
				"<div class='confirmBox-head'>" +
				"<div class='confirmBox-title'>"+options.head+"</div>" +
				"</div>";
			return headDOM;
		},
		//内容区
		innerHTML: function(options) {
			var content;

			//根据state的状态判断是调用 state提示内容，还是自定义内容 
			//如果state为空 或 iconState不包含 则一定为自定义内容 
			if (iconState.hasOwnProperty(options.state)) {
				content = this.stateMsg(options);
			} else {
				content = this.settingContent(options.state);
			}

			return "<div class='confirmBox-content' >" + content + "</div>";
		},
		//状态提示区
		stateMsg: function(options) {
			//提示图标
			var icon = "<div class='confirmBox-icon'><i class='icon iconfont cb-" + options.state + "'>" + iconState[options.state] + "</i></div>";
			//提示文案
			var msgContent = "<div class='confirmBox-state-content'>" +
				"<p class='confirmBox-state-title'>" + options.msgTitle + "</p>" +
				"<p class='confirmBox-state-text'>" + options.msgContent + "</p>" +
				"</div>";
			return icon + msgContent;

		},
		//自定义内容区
		settingContent: function(object) {
			var str, _type = Object.prototype.toString.call(object);
			switch (_type) {
				case "[object Object]":
					str = object.html();
					break;
				case "[object HTMLParagraphElement]":
					str = object.innerHTML;
					break;
				case "[object Function]":
					this.settingContent(object);
					break;
				case "[object Array]":
				case "[object Number]":
				case "[object String]":
					str = object.toString();
					break;
				default:
					str = "an error in the state ";
			}
			return str;
		},
		buttonHTML: function(options) {

			var buttonDOM = "<div class='confirmBox-button'>" +
				/* 确定按钮 */
				(options.confirmBtnSwitch ? ("<div class='confirmBox-confirm'>" +
					"<span  class='btn btn-blue cb-btn-confirm' " +
					(options.smartrackerOk ? " seed='" + options.smartrackerOk + "' smartracker='on' " : "") +
					"  >" + options.confirmBtn + "</span>   " +
					"</div>") : "") +
				/* 取消按钮 */
				(options.cancelBtnSwitch ? (
					"<div class='confirmBox-cancel'>" +
					(options.cancelBtn ? (options.cancelBtn) :
						"<span  class='btn  cb-btn-close' " +
						(options.smartrackerCancel ? " seed='" + options.smartrackerCancel + "' smartracker='on' " : "") +
						">取&nbsp;&nbsp;消</span>   ") +
					"</div>") : "") +

				"</div>";
			return buttonDOM;
		},
		//计算当前confirmBox 的坐标,并定位
		setCoordinate: function(options) {
			var left = ($(window).width() - parseInt(options.width)) / 2,
				top = (($(window).height() - parseInt(options.height)) / 2) + $(document).scrollTop();

			$(".cb-" + version).find(".confirmBox-border").css({
				"left": left + "px",
				"top": top + "px"
			});

		},
		//监听浏览器窗口变化，调整confirmBox的位置
		windowResize: function(options) {
			this.setCoordinate(options); //初始化坐标
			$(window).resize(function() {
				this.setCoordinate(options);
			});
		},
		//相关事件绑定
		onEvent: function(options) {
			var _this=this;
			var cbLength=$(".confirmBox").length
			$(".confirmBox:last").find(".confirmBox-close , .cb-btn-close,.cb-btn-confirm ").on("click", function(e) {
				e.preventDefault();

				if ($(this).attr("class").toString().indexOf("close") > 0) {
					_this.close();
				} else {
					options.autoClose ?
						_this.close(options.beforeClose) : options.beforeClose();
				}
			});
			_this.windowResize(options);
		},
		//根据参数生成并显示confirmbox
		open: function(object) {
			var elem = $(".cb-" + version);

			//参数校验
			var opations = this.verify(object);

			opations.beforeOpen();

			//生成DOM 
			var confirmDOM = this.creationDOM(opations);
			$("body").append(confirmDOM);
			//生成DOM后再事件绑定
			this.onEvent(opations);

			opations.afterOpen();

		},
		//点击x 或 取消按钮，则对confirmbox进行 remove处理 
		close: function(n, callback) {
			var obj = $(".cb-" + version),
				num = 0,
				arg = arguments.length;
			if (obj.length !== 0) {
				switch (arg) {
					case 0:
						num = obj.length - 1
						break;
					case 1:
						if (Object.prototype.toString.call(arguments[0]) === "[object Function]") {
							arguments[0]();
							num = obj.length - 1;
						} else {
							num = arguments[0].toString();
						}
						break;
					case 2:
						callback();
						num = arguments[0].toString();
					default:

						break;
				}
				obj.eq(num).remove();
				if ($(".cb-" + version).length === 0) {
					$(window).off("resize");
				}
			}
		}
	};
	// return  cb;
	confirmBox.prototype = cb;
	cb.open(define);
}