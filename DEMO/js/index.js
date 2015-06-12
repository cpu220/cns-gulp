$(document).ready(function() {
	var invitation = {
		init: function() {
			this.onEvent();
		},
		onEvent: function() {
			this.initSwiper();
		},
		initSwiper: function() {
			var swiper = new Swiper('.swiper-container', {
				// pagination: '.swiper-pagination',
				paginationClickable: true,
				speed:1000,
				mousewheelControl: true,
				direction: 'vertical'
			});
		}

	};
	invitation.init();

})