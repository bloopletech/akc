"use strict";

window.engine = function() {
  var CODES_MAP = { 37: "left", 38: "up", 39: "right", 40: "down", 65: "left", 87: "up", 68: "right", 83: "down" };

  window.$ = document.querySelector.bind(document);
  var $flasher;
  var $playField = $("#play-field");
  var $grindRatio = $("#grind-ratio");
  var $stack = $("#stack");
  var $stackTrack = $("#stack-track");
  var $timeRemainingTrack = $("#time-remaining-track");
  var $score = $("#score");
  var $streak = $("#streak");

  var highPrecisionTimer = (typeof window.performance == "object");
  var game = null;
  var currentCode = null;
  var state = null;
  var timeUsedUpdater = null;

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
    game = new Game(document.body.classList.contains("touch"));
    Music.play();

    setTimeout(function() {
      if(state != "waiting") return;
      transition("playing");

      setTimeout(function() {
        renderInfo();

        startRound(timeNow());
        updateTimeUsed();
      }, 0);
    }, 1500);
  }

  function showDirection(direction) {
    for(var i in Game.DIRECTIONS) document.body.classList.remove(Game.DIRECTIONS[i]);
    document.body.classList.add(direction);
  }

  function startRound() {
    showDirection(game.roundStarted(timeNow()));
    currentCode = null;
  }

  function updateTimeUsed() {
    var now = timeNow();
    timeUsedUpdater = window.requestAnimationFrame(updateTimeUsed);

    var grindRatio = game.grindRatio(now);
    $grindRatio.style.r = grindRatio > 0 ? ((grindRatio * 174) + 50) : 0;

    $timeRemainingTrack.style.strokeDashoffset = (1482.83 - (game.timeRemainingRatio(now) * 1482.83));

    $score.textContent = (game.score() + game.delta(now)).toLocaleString();

    if(game.timeRemaining(now) < 0) setTimeout(onTimeUsed, 0, now);
  }

  function onTimeUsed(now) {
    var code = currentCode;
    endRound(game.finishTime());

    if(state != "playing") return;

    currentCode = code;

    if(game.input(code)) {
      game.grindStarted(now);
      game.comboed();
    }
    else {
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
      if(!$("#game-over .play").matches(".disabled")) start();
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

  function flash(className) {
    if($flasher) $flasher.remove();

    $flasher = document.createElement("div");
    $flasher.id = "flasher";
    $flasher.className = className;
    document.body.insertBefore($flasher, document.body.firstChild);
  }

  function renderInfo(className) {
    $score.textContent = game.score().toLocaleString();
    $streak.textContent = game.streak().toLocaleString();

    $stack.style.strokeDasharray = ((1256.64 / game.maxStacks()) - 2) + " 2";
    $stackTrack.style.strokeDashoffset = ((game.stack() + 1) / game.maxStacks()) * 1256.64;

    flash(className);
  }

  function endRound(now) {
    currentCode = null;

    var isGameOver = game.roundEnded(now);
    renderInfo(isGameOver ? "failure" : "success");

    if(isGameOver) gameOver();
    else startRound(now);
  }

  function gameOver() {
    window.cancelAnimationFrame(timeUsedUpdater);

    showDirection("blank");
    $("#results-score").textContent = game.score().toLocaleString();
    $("#results-rank").textContent = Ranks.scoreRank(game.score()).humanName;
    $("#results-streak").textContent = game.streak().toLocaleString();
    transition("game-over");
    Music.pause();

    $("#game-over .play").classList.add("disabled");
    setTimeout(function() {
      $("#game-over .play").classList.remove("disabled");
    }, 1000);

    Api.submitScore(game);
  }

  function showMusicStatus() {
    $("#music-status").classList.remove("enabled", "disabled");
    $("#music-status").classList.add(Music.getEnabled() ? "enabled" : "disabled");
  }

  function updateMusicStatus() {
    Music.setEnabled(!Music.getEnabled());
    showMusicStatus();
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
    if(e.target.closest("#music-status")) updateMusicStatus();
    if(e.target.closest("#attribution-link")) {
      e.preventDefault();
      Modal.show($("#attribution").innerHTML);
    }
  });

  showMusicStatus();
};

document.addEventListener("DOMContentLoaded", engine);