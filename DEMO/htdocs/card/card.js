function card(obj) {

	var bodyStyle = document.body.style;
	bodyStyle.mozUserSelect = 'none';
	bodyStyle.webkitUserSelect = 'none';


	var canvas = document.getElementById(obj.elem);

	canvas.style.backgroundColor = 'transparent';
	canvas.style.position = 'absolute';

	var img = new Image();
	img.src = obj.url || "";

	img.addEventListener('load', function(e) {
		var cover;
		var w = obj.width || img.width,
			h = obj.height || img.height;
		var offsetX = canvas.offsetLeft,
			offsetY = canvas.offsetTop;
		var mousedown = false;

		function layer(cover) {
			cover.fillStyle = obj.cover || 'gray';
			cover.fillRect(0, 0, w, h);
		}

		function eventDown(e) {
			e.preventDefault();
			mousedown = true;
		}

		function eventUp(e) {
			e.preventDefault();
			mousedown = false;
		}

		function eventMove(e) {
			e.preventDefault();
			if (mousedown) {
				if (e.changedTouches) {
					e = e.changedTouches[e.changedTouches.length - 1];
				}
				var x = (e.clientX + document.body.scrollLeft || e.pageX) - offsetX || 0,
					y = (e.clientY + document.body.scrollTop || e.pageY) - offsetY || 0;
				with(cover) {
					beginPath()
					arc(x, y, obj.point || 20, 0, Math.PI * 2);
					fill();
				}
			}
		}

		canvas.width = w;
		canvas.height = h;
		canvas.style.backgroundImage = 'url(' + img.src + ')';

		cover = canvas.getContext('2d');
		cover.fillStyle = 'transparent';
		cover.fillRect(0, 0, w, h);
		layer(cover);

		cover.globalCompositeOperation = 'destination-out';

		canvas.addEventListener('touchstart', eventDown);
		canvas.addEventListener('touchend', eventUp);
		canvas.addEventListener('touchmove', eventMove);
		canvas.addEventListener('mousedown', eventDown);
		canvas.addEventListener('mouseup', eventUp);
		canvas.addEventListener('mousemove', eventMove);
	});
}