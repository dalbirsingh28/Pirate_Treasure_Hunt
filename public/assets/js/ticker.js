(function ($) {
	$.fn.ticker = function (options) {
		var defaults = {
			start: 0,
			end: 0,
			steps: 0,
			interval: 1000
		}
		var settings = $.extend({}, defaults, options);
		var This = $(this);
		countdown();
		setInterval(function () {
			settings.steps > 0 ? countdown() : null;
		}, settings.interval);

		function countdown() {
			parseInt(Math.round(settings.start)) > settings.end ? settings.start -= settings.steps : null;
			return settings.start >= 0 ? This.text(format(parseInt(Math.round(settings.start)))) : 0;
		}

		function format(value) {
			var parts = (+value).toFixed(2).split('.');
			var num = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (+parts[1] ? '.' + parts[1] : '');
			return num;
		};
		// public methods
		this.initialize = function () {
			return this;
		};
		this.set = function (obj) {
			obj.start ? settings.start = obj.start : null;
			obj.steps ? settings.steps = obj.steps : null;
			obj.end >= 0 ? settings.end = obj.end : null;
		}
		return this.initialize();
	};
}(jQuery));