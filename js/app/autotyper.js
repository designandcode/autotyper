var Autotyper = (function(){

	/* Init is our entrypoint into the function */
	function init(_opts){
		_tick = 0;
		_phrase = _opts.phrase || "The quick brown fox jumped over the lazy dog.";
		_currentphrase = '';
		_speed = _opts.speed || 400;
		_pause = 3000;
		_rewind = 0;
		_remaining = '';
		_optskeys = _.keys(_opts);
		_optscurrentkey = 0;
		_cursor = _opts.cursor || "&nbsp;";
		_cursorBG = _opts.cursorBG || "none";
		_home = _opts.home || "> ";
		_delay = _opts.delay || 0;

		//	UI Setup
		$('#documenttypeer').html(_home + '<span id="cursor" class="pulsating" style="background-color:'+_cursorBG+'">'+_cursor+'</span>');
		
		/*
		 *	The animation loop. We are checking for pause points and
		 *	further instructions like if we are rewinding and 
		 *	replacing text. 
		 *
		 * 	@todo - rewind resets the ticker so this breaks continuation
		 * 	after a rewind thus making it the last stable thing you can do.
		 * 	You can pause as many times as you wish before a rewind.
		 */
		function start(speed){
			setTimeout(function(){
				_delay = 0;
				_next = _optskeys[_optscurrentkey];
				_takeapart = _phrase.split("");
				_count = _takeapart.length;
				console.log(_count);

				uptick = setInterval(function(){
					if(_tick < _count) {
						_takeapart = _phrase.split("");
						_currentphrase += _takeapart[_tick];
						
						updateDisplay();
						if (_tick == _next) {
							//	console.log(_tick);
							$("#cursor").removeClass("fixed").addClass("pulsating");
							_optscurrentkey++;
							opts = _opts[_tick];
							var speed = opts.speed || _speed;
							var pause = opts.pause || _pause;
							var rewind = opts.rewind || _rewind;
							var remaining = opts.remaining || _remaining;
							clearInterval(uptick);
							//	Pause only
							if(rewind == 0){
								setTimeout(function(){
									if(remaining != ''){
										//	console.log('hijack the text dude');
										_phrase = _currentphrase + remaining;
									}
									//	_phrase = _currentphrase + remaining;
									start(speed);
								}, pause);
							}
							//	Pause and rewind
							else {
								setTimeout(function(){
									backtick = setInterval(function(){
										_currentphrase = _currentphrase.slice(0, -1);
										_phrase = _currentphrase + remaining;
										//	console.log(_currentphrase);
										updateDisplay();
										if(rewind == 1){
											clearInterval(backtick);
											_tick = _currentphrase.length;
											
											_takeapart = _currentphrase.split("");
											_count = _takeapart.length;
											console.log(_count);
											//	rewind = 0;
											start(speed);
										}
										rewind--;
									}, speed);
								}, pause);
							}					
						}
					}
					else{			
						clearInterval(uptick);
						$("#cursor").removeClass("fixed").addClass("pulsating");
					}
				}, speed);
			}, _delay);
			
		}
		
		start(_speed);

		/*
		 *	Responsible for updating the view and setting the global
		 *	_tick variable to the next tick
		 */
		function updateDisplay(){			
			$('#documenttypeer').html(_home + _currentphrase + '<span id="cursor" class="pulsating" style="background-color:'+_cursorBG+'">'+_cursor+'</span>');
			$('#formtyper').val( _currentphrase  + '_');
			_tick++;
		}


	}

		/*
		 *	Callable functions
		 */
		return {
			init: init
		}
})();