function inputEngine(engine) {
  var CODES_MAP = { 37: "left", 38: "up", 39: "right", 40: "down" };

  var currentKeyCode = null;
  var currentTouchCode = null;
  var state = engine.state;
  var game = engine.game;
  var endRound = engine.endRound;

  function onKeyDown(event) {
    var now = engine.timeNow();

    if(state() == "waiting") {
      event.preventDefault();
      return;
    }

    if(state() == "playing") {
      event.preventDefault();

      if(!currentKeyCode) {
        if(!game().input(CODES_MAP[event.keyCode])) {
          endRound(now);
          return;
        }

        currentKeyCode = event.keyCode;
        game().grindStarted(now);
      }
      else if(currentKeyCode != event.keyCode) {
        game().input();
        endRound(now);
      }

      return;
    }

    if(event.keyCode == 32 || event.keyCode == 13) {
      event.preventDefault();
      engine.start();
    }
  }

  function onKeyUp(event) {
    var now = engine.timeNow();

    if(state() == "waiting") {
      event.preventDefault();
      return;
    }

    if(state() == "playing") {
      if(!currentKeyCode || currentKeyCode != event.keyCode) {
        game().input();
        endRound(now);
        return;
      }
      else {
        currentKeyCode = null;
        endRound(now);
        return;
      }
    }
  }

  function onTouchStart(event) {
    var now = engine.timeNow();

    if(state() == "waiting") {
      event.preventDefault();
      return;
    }

    if(state() == "playing") {
      event.preventDefault();

      var code = event.target.dataset.direction;

      if(!currentTouchCode) {
        if(!game().input(code)) {
          endRound(now);
          return;
        }

        currentTouchCode = code;
        game().grindStarted(now);
      }
      else if(currentTouchCode != code) {
        game().input();
        endRound(now);
      }

      return;
    }
  }

  function onTouchEnd(event) {
    var now = engine.timeNow();

    if(state() == "waiting") {
      event.preventDefault();
      return;
    }

    if(state() == "playing") {
      var code = event.target.dataset.direction;

      if(!currentTouchCode || currentTouchCode != code) {
        game().input();
        endRound(now);
        return;
      }
      else {
        currentTouchCode = null;
        endRound(now);
        return;
      }
    }
  }

  function clear() {
    currentKeyCode = null;
    currentTouchCode = null;
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
