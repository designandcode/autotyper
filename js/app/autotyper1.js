Autotyper = function(){

	this.init = function(){

		//	Global variables
		_tick = 0;
		_speed = 300;

		// Functions
		this.startimer = function(){


			// start the timer
			this.start = function(){


				//	_phrase = "The quick brown fox jumped over the lazy dog.";
				_phrase = "The quick.";
				_putbacktogether = "";
				_breaks = {10: 1, 15: 3};
				_break = 3;
				_takeapart = _phrase.split("");
				_count = _takeapart.length;
				_totaltime = _speed  * _count;

				start();


				_control = {
					3: "pause",
					4: "start"
				}

				function move(){

					//	if(_tick < _count){
						_putbacktogether += _takeapart[_tick];
					//	}
					//	next();

					if (_.has(_control, _tick)) {
						if(_control[_tick] == "pause"){
							clearInterval(updateDisplay);
							setTimeout(function(){
								updateDisplay = setInterval(updateDisplay, _speed);
								//	console.log('foo');
								//	start();
								//	clearInterval(move);
								//	_tick++;
							}, 1000);
							// start();
							//	_count = _tick;
							//	_tick--;
							//	clearInterval(move);
							//	setTimeout(start, 1000);
							//	start();
						}
						if(_control[_tick] == "start") {
							//	_count = _takeapart.length;
						}
					} else {
						_tick++;
					}

					end();
					
					updateDisplay = setInterval(updateDisplay, _speed);
					//	this.updatedisplay(_putbacktogether);
				}

				function updateDisplay(){
					$('#documenttypeer').html(_putbacktogether + '_');
					$('#formtyper').val(_putbacktogether + '_');
				}

				function next(){
					_tick++;
				}
				function pause(time) {
					console.log(time);
					clearInterval(move);
					if(time){
						setTimeout(start, time);
					}
				}
				function rewind(steps) {
					_tick -= steps;
				}
				function start() {
					move = setInterval(move, _speed);
				}
				function end(){
					if (!_takeapart[_tick]) {
						clearInterval(move);
					}
				}
				//	move();

				//	start();

			};

			// update display
			this.updatedisplay = function(message){
				$('#documenttypeer').html(message + '_');
				$('#formtyper').val(message + '_');
			};

			this.start();
		};


		//	Events
		this.startimer();
	};
};