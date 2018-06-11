function inputEngine(engine) {
  var CODES_MAP = { 37: "left", 38: "up", 39: "right", 40: "down" };

  var currentKeyCode = null;
  var currentTouchCode = null;
  var state = engine.state;
  var game = engine.game;
  var endRound = engine.endRound;

  function onKeyDown(event) {
    if(state() == "waiting") {
      event.preventDefault();
      return;
    }

    if(state() == "playing") {
      event.preventDefault();

      if(!currentKeyCode) {
        if(!game().input(CODES_MAP[event.keyCode])) {
          endRound();
          return;
        }

        currentKeyCode = event.keyCode;
        game().grindStarted();
      }
      else if(currentKeyCode != event.keyCode) {
        game().input();
        endRound();
      }

      return;
    }

    if(event.keyCode == 32 || event.keyCode == 13) {
      event.preventDefault();
      engine.start();
    }
  }

  function onKeyUp(event) {
    if(state() == "waiting") {
      event.preventDefault();
      return;
    }

    if(state() == "playing") {
      if(!currentKeyCode || currentKeyCode != event.keyCode) {
        game().input();
        endRound();
        return;
      }
      else {
        currentKeyCode = null;
        game().grindEnded();
        endRound();
        return;
      }
    }
  }

  function onTouchStart(event) {
    if(state() == "waiting") {
      event.preventDefault();
      return;
    }

    if(state() == "playing") {
      event.preventDefault();

      var code = event.target.dataset.direction;

      if(!currentTouchCode) {
        if(!game().input(code)) {
          endRound();
          return;
        }

        currentTouchCode = code;
        game().grindStarted();
      }
      else if(currentTouchCode != code) {
        game().input();
        endRound();
      }

      return;
    }
  }

  function onTouchEnd(event) {
    if(state() == "waiting") {
      event.preventDefault();
      return;
    }

    if(state() == "playing") {
      var code = event.target.dataset.direction;

      if(!currentTouchCode || currentTouchCode != code) {
        game().input();
        endRound();
        return;
      }
      else {
        currentTouchCode = null;
        game().grindEnded();
        endRound();
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
  });

  return {
    clear: clear
  };
}
