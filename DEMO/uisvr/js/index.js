$(document).ready(function() {
	var invitation = {
		init: function() {
			this.onEvent();
		},
		onEvent: function() {
			this.initSwiper();
			this.onClick();
		},
		initSwiper: function() {
			var _this = this;
			var mySwiper = new Swiper('.swiper-container', {
				// pagination: '.swiper-pagination',
				paginationClickable: true,
				speed: 1000,
				mousewheelControl: true,
				direction: 'vertical',
				onSlideChangeEnd: function(swpier) {
					_this.pageAction(swpier);

				}

			});
		},
		pageAction: function(object) {
			var n = object.activeIndex,
				per = object.previousIndex;

			var elem_now = object.slides[n]; //当前页面
			var elem_pre = object.slides[per]; //上一页面

			$(elem_now).addClass("act");
			console.log(elem_now);
			console.log(elem_pre);

		},
		onClick: function() {
			$(".J-submit").on("click", function() {
				var type = $(this).data("type");
				// d = (type == "object" ? $("#form1").serializeArray() : $("#form1").serialize());
				jQuery.ajax({
					type: "POST",
					url: "", 
					data:$("#form1").serializeArray(), 
					success: function(data) {
						console.log(data);
					},
					error: function(err) {
						console.log(err);
					}
				})
			});
		}

	};
	invitation.init();

})