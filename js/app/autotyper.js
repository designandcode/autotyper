var Autotyper = function(_opts){
  if(!_opts || !Object.keys(_opts).length){ 
    this.type = function(){ return; }
    return this;
  }
  var t = this;
  t._tick = 0;
  t._phrase = _opts.phrase || "The quick brown fox jumped over the lazy dog.";
  t._currentphrase = '';
  t._speed = _opts.speed || 400;
  t._pause = 3000;
  t._rewind = 0;
  t._remaining = '';
  t._optskeys = _.keys(_opts);
  t._optscurrentkey = 0;
  t._cursor = _opts.cursor || "&nbsp;";
  t._cursorBG = _opts.cursorBG || "none";
  t._home = _opts.home || "> ";
  t._delay = _opts.delay || 0;
  t._end = 0;
  //  UI Setup
  $('#documenttypeer').html(t._home + '<span id="cursor" class="pulsating" style="background-color:'+t._cursorBG+'">'+t._cursor+'</span>');    
  /*
   *  The animation loop. We are checking for pause points and
   *  further instructions like if we are rewinding and 
   *  replacing text. 
   *
   *  @todo - rewind resets the ticker so this breaks continuation
   *  after a rewind thus making it the last stable thing you can do.
   *  You can pause as many times as you wish before a rewind.
   */
  this.start = function(){
    setTimeout(function(){
      _next = _optskeys[_optscurrentkey];
      _takeapart = t._phrase.split("");
      _count = _takeapart.length;
      uptick = setInterval(function(){
        if(t._tick < _count) {
          _currentphrase += _takeapart[t._tick]; 
          t._tick++;           
          updateDisplay();
          if (t._tick == _next) {
            $("#cursor").removeClass("fixed").addClass("pulsating");
            t._optscurrentkey++;
            opts = _opts[t._tick];
            var speed = opts.speed || t._speed;
            var pause = opts.pause || t._pause;
            var rewind = opts.rewind || _rewind;
            var remaining = opts.remaining || t._remaining;
            clearInterval(uptick);
            //  Pause only
            if(rewind == 0){
              setTimeout(function(){
                if(remaining != ''){
                  t._phrase = _currentphrase + remaining;
                }
                this.type();
              }, pause);
            }
            //  Pause and rewind
            else {
              setTimeout(function(){
                backtick = setInterval(function(){
                  t._currentphrase = t._currentphrase.slice(0, -1);
                  t._phrase = t._currentphrase + remaining;
                  updateDisplay();
                  if(rewind == 1){
                    clearInterval(backtick);
                    t._tick = t._currentphrase.length;                      
                    _takeapart = _currentphrase.split("");
                    _count = _takeapart.length;
                    this.type();
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
      }, t._speed);
    }, t._delay);     
    return t; 
  }
  /*
   *  Responsible for updating the view to show the _currentphrase
   */
  function updateDisplay(){     
    $('#documenttypeer').html(t._home + t._currentphrase + '<span id="cursor" class="pulsating" style="background-color:'+t._cursorBG+'">'+t._cursor+'</span>');
    $('#formtyper').val( t._currentphrase  + '_');
  }
  this.type = function(){
    t._end += t._phrase.length * t._speed + t._delay;
    t.start();
    return t;
  };
  this.pause = function(delay){
    var _end = t._end;
    t._end += delay;
    setTimeout(function(){      
      t._end += delay;
    }, _end);
    return t;
  }
  this.add = function(opts){
    var _end = t._end;
    t._end += opts.characters.length * (opts.speed || t._speed);
    setTimeout(function(){
      t._end += opts.characters.length * (opts.speed || t._speed);
      var _tick = 0;
      var _count = opts.characters.length;
      var _takeapart = opts.characters.split("");
      var uptick = setInterval(function(){
        if(_tick < _count){
          t._currentphrase += _takeapart[_tick];
          _tick++;
          updateDisplay();
        } else{
          clearInterval(uptick);
        }
      }, opts.speed || t._speed)
    }, _end);
    return t;
  }
  this.rewind = function(opts){
    var _end = t._end;
    t._end += opts.spaces * (opts.speed || t._speed);
    setTimeout(function(){
      var _tick = 0;
      var _count = opts.spaces;
      t._end += _count * (opts.speed || t._speed);
      var uptick = setInterval(function(){
        if(_tick < _count){
          t._currentphrase = t._currentphrase.slice(0, -1);
          _tick++;
          updateDisplay();
        } else{
          clearInterval(uptick);
        }
      }, opts.speed || t._speed)
    }, _end)
    return t;
  }
  this.remove = function(opts){
    t.pause(opts.speed || t._speed);
    var _end = t._end;
    t._end += opts.characters.length * (opts.speed || t._speed);
    setTimeout(function(){
      var _tick = 0;
      var _count = opts.characters.length;
      var _match = new RegExp(opts.characters+'$');
      t._end += _count * (opts.speed || t._speed);
      if(t._currentphrase.match(_match)){
        var uptick = setInterval(function(){
          if(_tick < _count){
            t._currentphrase = t._currentphrase.slice(0, -1);
            _tick++;
            updateDisplay();
          } else{
            clearInterval(uptick);
          }
        }, opts.speed || t._speed)
      }
    }, _end)
    return t;
  }
  this.clear = function(){
    t.pause(100);
    var _end = t._end;
    setTimeout(function(){ 
      t._currentphrase = '';
    }, _end)
    return t;
  }
  return this;
};
