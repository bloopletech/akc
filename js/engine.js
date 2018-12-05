"use strict";

window.engine = function() {
  var CODES_MAP = { 37: "left", 38: "up", 39: "right", 40: "down", 65: "left", 87: "up", 68: "right", 83: "down" };

  window.$ = document.querySelector.bind(document);
  var $grindRatio = $("#grind-ratio");
  var $stack = $("#stack");
  var $stackTrack = $("#stack-track");
  var $timeRemainingTrack = $("#time-remaining-track");
  var $delta = $("#delta");
  1.0.toLocaleString(); //Preload the NumberFormat

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

      renderInfo();
      startRound(timeNow());
      updateTimeUsed();
    }, 500);
  }

  function showDirection(direction) {
    for(var i in Pattern.DIRECTIONS) document.body.classList.remove(Pattern.DIRECTIONS[i]);
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
    $grindRatio.style.r = grindRatio > 0 ? (30 + (grindRatio * 194)) : 0;

    $timeRemainingTrack.style.strokeDashoffset = (1482.83 - (game.timeRemainingRatio(now) * 1482.83));

    if(game.grinding()) document.body.classList.add("grinding");
    else document.body.classList.remove("grinding");

    $delta.textContent = game.delta(now).toLocaleString();

    if(game.timeRemaining(now) < 0) setTimeout(onTimeUsed, 0, now);
  }

  function onTimeUsed(now) {
    if(!game.canCombo()) {
      endRound(now, "");
      return;
    }

    var code = currentCode;
    endRound(game.finishTime(), "");
    currentCode = code;

    game.input(code);
    game.grindStarted(now);
    game.comboed();
    flash("comboed");
  }

  function onInputStart(event, code) {
    if(state != "playing") return;
    event.preventDefault();

    if(!currentCode) {
      if(!game.input(code)) {
        endRound(event.timeStamp);
        return;
      }

      currentCode = code;
      game.grindStarted(event.timeStamp);
    }
    else if(currentCode != code) {
      game.input();
      endRound(event.timeStamp);
    }
  }

  function onInputEnd(event, code) {
    if(state == "waiting") {
      event.preventDefault();
      return true;
    }

    if(state != "playing") return false;
    event.preventDefault();

    if(!currentCode || currentCode != code) game.input();
    endRound(event.timeStamp);
  }

  function onKeyDown(event) {
    onInputStart(event, CODES_MAP[event.keyCode]);
  }

  function onKeyUp(event) {
    if(onInputEnd(event, CODES_MAP[event.keyCode])) return;

    if(event.keyCode == 32 || event.keyCode == 13) {
      event.preventDefault();
      if(!$("#game-over .play").matches(".disabled")) start();
    }
  }

  function onTouchStart(event) {
    onInputStart(event, event.target.dataset.direction);
  }

  function onTouchEnd(event) {
    onInputEnd(event, event.target.dataset.direction);
  }

  function flash(type) {
    if(type == null) type = "success";

    var $flasher = $("#flasher").cloneNode();
    $flasher.style.fill = "url(#gradient-flasher-" + type + ")";
    $("#time-remaining").replaceChild($flasher, $("#flasher"));
  }

  function renderInfo() {
    $stack.style.strokeDasharray = ((1288.05 / game.maxStacks()) - 4) + " 4";
    $stackTrack.style.strokeDashoffset = ((game.stack() + 1) / game.maxStacks()) * 1288.05;
  }

  function endRound(now, flashType) {
    currentCode = null;

    game.roundEnded(now);
    renderInfo();
    flash(flashType);

    if(game.outcome()) gameOver();
    else startRound(now);
  }

  function resetPlayField() {
    showDirection("blank");
    document.body.classList.remove("grinding");
    $grindRatio.style.r = 0;
    $delta.textContent = "0";
    $timeRemainingTrack.style.strokeDashoffset = 0;
    $stackTrack.style.strokeDashoffset = 0;
  }

  function gameOver() {
    window.cancelAnimationFrame(timeUsedUpdater);

    rejectTouchPlay();
    resetPlayField();
    $("#results-score").textContent = game.score().toLocaleString();
    $("#results-rank").textContent = Ranks.scoreRank(game.score()).humanName;
    $("#results-streak").textContent = game.streak().toLocaleString();
    $("#results-outcome").textContent = Game.formatOutcome(game.outcome());
    transition("game-over");
    Music.pause();

    Api.submitScore(game);
  }

  function rejectTouchPlay() {
    if(document.body.classList.contains("touch")) {
      $("#game-over .play").classList.add("disabled");
      setTimeout(function() {
        $("#game-over .play").classList.remove("disabled");
      }, 500);
    }
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
  });
};

document.addEventListener("DOMContentLoaded", engine);
