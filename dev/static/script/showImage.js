(function () {
	var roomTalk = $('.talk-list');

	var SHOWIMAGE = {
		init: function() {
			SHOWIMAGE.imgShowBind();
		},
		imgShowBind: function() {
			// var imgObj = $('img[data-show="true"]');

			// touch.on(imgObj, 'tap', function() {
				// if($('.showImage')) {
				// 	$('.showImage').remove();
				// }

				// imgUrl = $(this).attr('src');
				// $('body').append('<section class="showImage" id="showImage" style="display: none;"><img src="'+ imgUrl +'"></section>');
				// $('.showImage').fadeIn(200);

				// SHOWIMAGE.imageMaskBind();
				// SHOWIMAGE.imageOnloadBind(imgUrl);
			// });

			touch.on(roomTalk, 'tap', function(e) {
				if(e.target.nodeName == 'IMG' && this.getAttribute('data-show') == 'true') {
					if($('.showImage')) {
						$('.showImage').remove();
					}

					imgUrl = this.getAttribute('src');
					$('body').append('<section class="showImage" id="showImage" style="display: none;"><img src="'+ imgUrl +'"></section>');
					$('.showImage').fadeIn(200);

					SHOWIMAGE.imageMaskBind();
					SHOWIMAGE.imageOnloadBind(imgUrl);
				}
			});
		},
		imageMaskBind: function() {
			var mask = $('.showImage');
			touch.on(mask, 'tap', function() {
				mask.fadeOut(200);
			});
		},
		imageOnloadBind: function(url) {
			var obj = $('.showImage img'),
				img = new Image();

			img.src = url;
			img.onload = function() {
				var _w = this.width,
					_h = this.height,
					_bl = _w/_h,
					w = $('.showImage').width(),
					h = $('.showImage').height(),
					bl = w/h;

				if(_bl > bl) {
					var imgW = w,
						imgH = _h * w / _w;
					obj.css({
						'width': imgW,
						'height': imgH,
						'top': 0.5 * (h - imgH),
						'left': 0
					});
				} else {
					var imgH = h,
						imgW = _w * h / _h;
					obj.css({
						'width': imgW,
						'height': imgH,
						'top': 0,
						'left': 0.5 * (w - imgW)
					});
				}

				SHOWIMAGE.imageOperateBind();
			}
		},
		imageOperateBind: function() {
			var obj = $('.showImage img'),
				_ml,
				_mt;

			touch.on('touchstart', function(e) {
				e.preventDefault();
			});

			obj.bind('dragstart', function() {
				_ml = parseInt(obj.css('margin-left').split('px')[0]);
				_mt = parseInt(obj.css('margin-top').split('px')[0]);
			});
			touch.on(obj, 'drag', function(e) {
				obj.css('margin', (_mt + e.distanceY) + 'px 0 0 ' + (_ml + e.distanceX) + 'px');
			});

			var initialScale = 1,
				currScale,
				target = document.getElementById('showImage');
			target.style.webkitTransition = 'all ease 0.05s';
			touch.on(target, 'pinch', function(e) {
				currScale = e.scale - 1;
				currScale = initialScale + currScale;
				// currScale = currScale > 2 ? 2 : currScale;
				// currScale = currScale < 1 ? 1 : currScale;
				this.style.webkitTransform = 'scale('+ currScale +')';
			});
			touch.on(target, 'pinchend', function(e) {
				initialScale = currScale;
			});

		}
	};

	SHOWIMAGE.init();
}());
