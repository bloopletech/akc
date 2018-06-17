function inputEngine(engine) {
  var CODES_MAP = { 37: "left", 38: "up", 39: "right", 40: "down" };

  var currentCode = null;
  var state = engine.state;
  var game = engine.game;
  var endRound = engine.endRound;

  function onStart(now, event, code) {
    if(state() == "waiting") {
      event.preventDefault();
      return true;
    }

    if(state() == "playing") {
      event.preventDefault();

      if(!currentCode) {
        if(!game().input(code)) {
          endRound(now);
          return true;
        }

        currentCode = code;
        game().grindStarted(now);
      }
      else if(currentCode != code) {
        game().input();
        endRound(now);
      }

      return true;
    }

    return false;
  }

  function onEnd(now, event, code) {
    if(state() == "waiting") {
      event.preventDefault();
      return;
    }

    if(state() == "playing") {
      if(!currentCode || currentCode != code) {
        game().input();
        endRound(now);
      }
      else {
        currentCode = null;
        endRound(now);
      }
    }
  }

  function onKeyDown(event) {
    var now = engine.timeNow();
    var code = CODES_MAP[event.keyCode];

    if(onStart(now, event, code)) return;

    if(event.keyCode == 32 || event.keyCode == 13) {
      event.preventDefault();
      engine.start();
    }
  }

  function onKeyUp(event) {
    var now = engine.timeNow();
    var code = CODES_MAP[event.keyCode];

    onEnd(now, event, code);
  }

  function onTouchStart(event) {
    var now = engine.timeNow();
    var code = event.target.dataset.direction;

    onStart(now, event, code);
  }

  function onTouchEnd(event) {
    var now = engine.timeNow();
    var code = event.target.dataset.direction;

    onEnd(now, event, code);
  }

  function clear() {
    currentCode = null;
  }

  if(window.innerWidth >= 460) {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
  }
  else {
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchend", onTouchEnd);
  }

  document.body.addEventListener("click", function(e) {
    if(e.target.matches(".play")) engine.start();
    if(e.target.closest("#player-status")) engine.updatePlayerStatus();
  });

  return {
    clear: clear
  };
}
