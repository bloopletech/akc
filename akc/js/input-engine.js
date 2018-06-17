function inputEngine(engine) {
  var CODES_MAP = { 37: "left", 38: "up", 39: "right", 40: "down" };

  var currentCode = null;
  var state = engine.state;
  var game = engine.game;
  var endRound = engine.endRound;

  function onStart(event, code) {
    if(state() == "waiting") {
      event.preventDefault();
      return true;
    }

    if(state() == "playing") {
      event.preventDefault();

      if(!currentCode) {
        if(!game().input(code)) {
          endRound(event.timeStamp);
          return true;
        }

        currentCode = code;
        game().grindStarted(event.timeStamp);
      }
      else if(currentCode != code) {
        game().input();
        endRound(event.timeStamp);
      }

      return true;
    }

    return false;
  }

  function onEnd(event, code) {
    if(state() == "waiting") {
      event.preventDefault();
      return;
    }

    if(state() == "playing") {
      if(!currentCode || currentCode != code) {
        game().input();
        endRound(event.timeStamp);
      }
      else {
        currentCode = null;
        endRound(event.timeStamp);
      }
    }
  }

  function onKeyDown(event) {
    var code = CODES_MAP[event.keyCode];

    if(onStart(event, code)) return;

    if(event.keyCode == 32 || event.keyCode == 13) {
      event.preventDefault();
      engine.start();
    }
  }

  function onKeyUp(event) {
    var code = CODES_MAP[event.keyCode];

    onEnd(event, code);
  }

  function onTouchStart(event) {
    var code = event.target.dataset.direction;

    onStart(event, code);
  }

  function onTouchEnd(event) {
    var code = event.target.dataset.direction;

    onEnd(event, code);
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
