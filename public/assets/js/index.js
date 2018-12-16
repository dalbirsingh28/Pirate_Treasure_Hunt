var App = {
	speed: 0,
	time: 0,
	ticker: null,
	stop: 0,
	totalpoints: 0,
	promoPoints: 0,
	// Initialization
	init: function (obj) {
		var THIS = this;
		this.time = obj.time;
		this.speed = obj.speed;
		this.stop = obj.points;
		this.totalpoints = obj.points;
		this.promoPoints = obj.points;
		this.defauktTickerSet();
		// socket
		var socket = io.connect("/");
		socket.on("crashscenario", function (data) {
			THIS.defauktTickerSet(data);
		});

		socket.on("treasures", function (data) {
			THIS.render(data['lastFive'], data['lastFiveMinuteFound']);
		});
		// send update event to server after time
		setInterval(() => {
			socket.emit('update');
		}, THIS.time);
	},
	defauktTickerSet: function (points = 0) {
		if (points > 0 && points < this.totalpoints) {
			// execute in crash scenario
			this.totalpoints -= points;
			this.stop = this.totalpoints;
			this.ticker = $(".js-ticker").ticker({
				start: this.totalpoints,
				end: this.stop,
				steps: 0,
				interval: this.speed
			});
		} else {
			// execute when run first time
			this.ticker = $(".js-ticker").ticker({
				start: this.totalpoints,
				end: this.totalpoints,
				steps: 0,
				interval: this.speed
			});
		}
		// if treasures already founded
		(points >= this.promoPoints) ? this.treasuresFound(): null;
	},
	// render data
	render: function (lastfivewinners, lastFiveMinuteFound) {
		var THIS = this;
		// island render
		var points = $('.js-island-points');
		var date = $('.js-island-date');
		for (var i = 0; i < lastfivewinners.length; i++) {
			switch (parseInt(lastfivewinners[i].id)) {
				case 23:
					points[0].innerHTML = lastfivewinners[i].points;
					date[0].innerHTML = "(" + lastfivewinners[i].date + ")";
					break;
				case 24:
					points[1].innerHTML = lastfivewinners[i].points;
					date[1].innerHTML = "(" + lastfivewinners[i].date + ")";
					break;
				case 25:
					points[2].innerHTML = lastfivewinners[i].points;
					date[2].innerHTML = "(" + lastfivewinners[i].date + ")";
					break;
				case 26:
					points[3].innerHTML = lastfivewinners[i].points;
					date[3].innerHTML = "(" + lastfivewinners[i].date + ")";
					break;
				case 27:
					points[4].innerHTML = lastfivewinners[i].points;
					date[4].innerHTML = "(" + lastfivewinners[i].date + ")";
					break;
				default:
					console.log('Wrong island ID. Check your CSV!');
					break;
			}
		}
		//ticker
		if (lastFiveMinuteFound > 0) {
			this.stop -= lastFiveMinuteFound;
			if (this.stop >= 0) {
				this.ticker.set({
					end: this.stop,
					steps: this.findStepValue(lastFiveMinuteFound, this.time, this.speed),
				});
			}
			// if all treasures found
			if (this.stop == 0) {
				setTimeout(function () {
					THIS.treasuresFound();
				}, THIS.time);
			}
		}
	},
	findStepValue: function (points, time, speed) {
		return (points / (time / speed));
	},
	// to show curtains
	treasuresFound: function () {
		$('.footer').css('display', 'none');
		$('.curtains').slideDown(1000);
	}
}
//=======================================
// 5 min = time: 300000
$(function () {
	App.init({
		points: 3000000,
		time: 300000,
		speed: 1000
	});
});