describe("autotyperTest", function(){
  describe("autotyperFixedTest", function(){
    var timerCallback;
    beforeEach(function() {
      timerCallback = jasmine.createSpy("timerCallback");
      jasmine.clock().install();
    });
    afterEach(function() {
      jasmine.clock().uninstall();
    });
    it("handles no parm gracefully", function(){//#1
      var autotyper = Autotyper().type();
      expect(autotyper).toBe(undefined);
      var autotyper = Autotyper({}).type();
      expect(autotyper).toBe(undefined);
    });
    it("printing ends after phrase printed at default speed per character", function(){//#2
      var autotyper = Autotyper({
        phrase: 'Hello Monde!'
      }).type();
      expect(autotyper._end).toEqual(4800);
    });
    it("printing ends after phrase printed at 100ms speed per character after a 1000ms delay", function(){//#3
      var autotyper = Autotyper({
        phrase: 'Hello Monde!',
        speed: 100,
        delay: 1000
      }).type();
      expect(autotyper._end).toEqual(2200);
    });
    it("printing ends after phrase printed at default speed per character after a 1000ms delay", function(){//#3
      var autotyper = Autotyper({
        phrase: 'Hello Monde!',
        delay: 1000
      }).type();
      expect(autotyper._end).toEqual(5800);
    });
    it("printing ends after phrase printed at 100ms speed per character", function(){//#3
      var autotyper = Autotyper({
        phrase: 'Hello Monde!',
        speed: 100
      }).type();
      expect(autotyper._end).toEqual(1200);
    });
    it("prints out the phrase at default speed", function(){//#4
      var autotyper = Autotyper({
        phrase: 'Hello Monde!'
      }).type();
      jasmine.clock().tick(autotyper._end); // 4800
      expect(autotyper._currentphrase).toEqual('Hello Monde!');
    });
    it("#5 prints out the phrase at 100ms per character and 1000ms delay", function(){//#5
      var autotyper = Autotyper({
        phrase: 'Hello Monde!',
        speed: 100,
        delay: 1000
      }).type();
      jasmine.clock().tick(autotyper._end); // 2200
      expect(autotyper._currentphrase).toEqual('Hello Monde!');
    });
    it("#5 prints out the phrase at default speed per character and 1000ms delay", function(){//#5
      var autotyper = Autotyper({
        phrase: 'Hello Monde!',
        delay: 1000
      }).type();
      jasmine.clock().tick(autotyper._end); // 2200
      expect(autotyper._currentphrase).toEqual('Hello Monde!');
    });
    it("#5 prints out the phrase at 100ms speed per character", function(){//#5
      var autotyper = Autotyper({
        phrase: 'Hello Monde!',
        speed: 100
      }).type();
      jasmine.clock().tick(autotyper._end); // 1200
      expect(autotyper._currentphrase).toEqual('Hello Monde!');
    });
    it("prints out the phrase 'Hello World!' at default speed per character and a 1000ms pause in the middle", function(){//#6
      var autotyper = Autotyper({
        phrase: 'Hello '
      }).type()
        .pause(1000)
        .add({characters: 'World!'});
      jasmine.clock().tick(autotyper._end); // 5800
      expect(autotyper._currentphrase).toEqual('Hello World!');
    });
    it("prints out 'Hello Monde!' then pauses for 1000ms then rewinds 7 spaces then prints out ' World!' at default speed", function(){//#7
      var autotyper = Autotyper({
        phrase: 'Hello Monde!'
      }).type()
        .pause(1000)
        .rewind({spaces:7})
        .add({characters:' World!'});
      jasmine.clock().tick(autotyper._end); //11400
      expect(autotyper._currentphrase).toEqual('Hello World!');
    });
    it("prints 'Hello World!' then clears", function(){
      var autotyper = Autotyper({
        phrase: 'Hello World!'
      }).type().clear();
      jasmine.clock().tick(autotyper._end);
      expect(autotyper._currentphrase).toEqual('');
    });
    it("prints 'Hello Monde!' then clears then prints 'Hello World!'", function(){
      var autotyper = Autotyper({
        phrase: 'Hello Monde!'
      }).type().clear().add({characters:'Hello World!'});
      jasmine.clock().tick(autotyper._end);
      expect(autotyper._currentphrase).toEqual('Hello World!');
    });
    it("prints 'Hello Monde!' then removes ' Monde!'", function(){
      var autotyper = Autotyper({
        phrase: 'Hello Monde!'
      }).type().remove({characters: ' Monde!'});
      jasmine.clock().tick(autotyper._end);
      expect(autotyper._currentphrase).toEqual('Hello');
    });
    it("prints 'Hello Monde!' then removes ' Monde!' then types 'World!'", function(){
      var autotyper = Autotyper({
        phrase: 'Hello Monde!'
      }).type().remove({characters: 'Monde!'}).add({characters:'World!'});
      jasmine.clock().tick(autotyper._end);
      expect(autotyper._currentphrase).toEqual('Hello World!');
    });
    it("runs the demo using rewind method", function(){
      var autotyper = Autotyper({
        phrase: 'The ', //4
        speed: 100,
        home: '$ ',
        //  cursor: '&nbsp;&nbsp;',
        cursorBG: '#fff',
        delay: 2000
      }).type()
        .pause(1000)
        .add({characters: 'quick ', speed:400}) //10
        .pause(2000)
        .add({characters: 'brown fox', speed:400}) //19
        .pause(2000)
        .rewind({spaces:15, speed:100})
        .add({characters: 'lazy dog lied beneath the quick jumping brown fox'})
        .pause(2000)
        .add({characters: ' ... ', speed: 600})
        .pause(2000)
        .rewind({spaces:5, speed: 200})
        .pause(600)
        .add({characters: '!'});
      jasmine.clock().tick(autotyper._end); // 10000
      expect(autotyper._currentphrase).toEqual('The lazy dog lied beneath the quick jumping brown fox!');
    });
    it("runs the demo using remove method", function(){
      var autotyper = Autotyper({
        phrase: 'The ', //4
        speed: 100,
        home: '$ ',
        //  cursor: '&nbsp;&nbsp;',
        cursorBG: '#fff',
        delay: 2000
      }).type()
        .pause(1000)
        .add({characters: 'quick ', speed:400}) //10
        .pause(2000)
        .add({characters: 'brown fox', speed:400}) //19
        .pause(2000)
        .remove({characters:'quick brown fox', speed:100})
        .add({characters: 'lazy dog lied beneath the quick jumping brown fox'})
        .pause(2000)
        .add({characters: ' ... ', speed: 600})
        .pause(2000)
        .rewind({spaces:5, speed: 200})
        .pause(600)
        .add({characters: '!'});
      jasmine.clock().tick(autotyper._end); // 10000
      expect(autotyper._currentphrase).toEqual('The lazy dog lied beneath the quick jumping brown fox!');
    });
  });
});
