$(document).ready(function() {
	var invitation = {
		init: function() {
			this.onEvent();
		},
		onEvent: function() {
			this.initSwiper();
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
			var n=object.activeIndex,
				per=object.previousIndex;

			var elem_now= object.slides[n]; //当前页面
			var elem_pre=object.slides[per]; //上一页面

			$(elem_now).addClass("act");
			console.log(elem_now);
			console.log(elem_pre);
			 
		}

	};
	invitation.init();

})