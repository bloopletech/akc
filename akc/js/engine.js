function engine() {
  var DIRECTION_CLASSES = ["left", "up", "right", "down"];
  var CODES_MAP = { 37: "left", 38: "up", 39: "right", 40: "down" };

  var $ = document.querySelector.bind(document);
  var $timeRemainingTrack = $("#time-remaining-track");
  var $playField = $("#play-field");
  var $out = $("#out");
  var $score = $("#score");
  var $stack = $("#stack");

  var arrowRatio = window.innerWidth >= 460 ? 0.9 : 0.6;
  var highPrecisionTimer = (typeof window.performance == "object");
  var game = null;
  var currentCode = null;
  var state = null;

  function timeNow() {
    return highPrecisionTimer ? performance.now() : Date.now();
  }

  function transition(newState) {
    state = newState;
    document.body.classList.remove("attract", "waiting", "playing", "game-over");
    document.body.classList.add(state);
  }

  function start() {
    transition("waiting");
    game = new Game();
    Player.play();

    setTimeout(function() {
      if(state != "waiting") return;
      transition("playing");
      renderInfo();

      startRound();
      updateTimeUsed();
    }, 1500);
  }

  function showDirection(direction) {
    for(var i in DIRECTION_CLASSES) document.body.classList.remove(DIRECTION_CLASSES[i]);
    document.body.classList.add(direction);
  }

  function startRound() {
    showDirection(game.roundStarted(timeNow()));
    currentCode = null;
  }

  function updateTimeUsed() {
    var now = timeNow();
    timeUsedUpdater = window.requestAnimationFrame(updateTimeUsed);

    var ratio = game.timeRemainingRatio(now);

    var c = 285.88;
    $timeRemainingTrack.style.strokeDashoffset = ((100 - (ratio * 100)) / 100) * c;

    if(game.grinding()) $playField.classList.add("grind");
    else $playField.classList.remove("grind");

    $out.style.transform = "scale(" + ((game.grindRatio(now) * arrowRatio) + 1) + ")";

    $score.textContent = nice(game.score() + game.delta(now));

    if(game.timeRemaining(now) < 0) {
      game.input();
      endRound(now);
    }
  }

  function onInputStart(event, code) {
    if(state == "waiting") {
      event.preventDefault();
      return true;
    }

    if(state != "playing") return false;

    event.preventDefault();

    if(!currentCode) {
      if(!game.input(code)) {
        endRound(event.timeStamp);
        return true;
      }

      currentCode = code;
      game.grindStarted(event.timeStamp);
    }
    else if(currentCode != code) {
      game.input();
      endRound(event.timeStamp);
    }

    return true;
  }

  function onInputEnd(event, code) {
    if(state == "waiting") {
      event.preventDefault();
      return;
    }

    if(state == "playing") {
      if(!currentCode || currentCode != code) game.input();
      endRound(event.timeStamp);
    }
  }

  function onKeyDown(event) {
    if(onInputStart(event, CODES_MAP[event.keyCode])) return;

    if(event.keyCode == 32 || event.keyCode == 13) {
      event.preventDefault();
      start();
    }
  }

  function onKeyUp(event) {
    onInputEnd(event, CODES_MAP[event.keyCode]);
  }

  function onTouchStart(event) {
    onInputStart(event, event.target.dataset.direction);
  }

  function onTouchEnd(event) {
    onInputEnd(event, event.target.dataset.direction);
  }

  function renderInfo() {
    $score.textContent = nice(game.score());
    $stack.textContent = game.maxStacks() - game.stack();
  }

  function endRound(now) {
    currentCode = null;

    var isGameOver = game.roundEnded(now);
    renderInfo();

    if(isGameOver) gameOver();
    else startRound();
  }

  function nice(num) {
    var x = num + '';
    var rgx = /(\d+)(\d{3})/;
    while(rgx.test(x)) x = x.replace(rgx, '$1' + ',' + '$2');
    return x;
  }

  function gameOver() {
    window.cancelAnimationFrame(timeUsedUpdater);

    showDirection("blank");
    $("#results-score").textContent = nice(game.score());
    $("#results-rank").textContent = Ranks.scoreRank(game.score()).humanName;
    $("#results-streak").textContent = game.streak();
    transition("game-over");
    Player.pause();

    $("#game-over .play").classList.add("disabled");
    setTimeout(function() {
      $("#game-over .play").classList.remove("disabled");
    }, 1000);
  }

  function showPlayerStatus() {
    $("#player-status").classList.remove("enabled", "disabled");
    $("#player-status").classList.add(Player.getEnabled() ? "enabled" : "disabled");
  }

  function updatePlayerStatus() {
    Player.setEnabled(!Player.getEnabled());
    showPlayerStatus();
  }

  function touchDevice() {
    document.body.classList.add("touch");

    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchend", onTouchEnd);
    $(".play").removeEventListener("touchstart", touchDevice);
  }

  $(".play").addEventListener("touchstart", touchDevice);

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  document.body.addEventListener("click", function(e) {
    if(e.target.matches(".play:not(.disabled)")) start();
    if(e.target.closest("#player-status")) updatePlayerStatus();
  });

  showPlayerStatus();
  transition("attract");
};

document.addEventListener("DOMContentLoaded", engine);