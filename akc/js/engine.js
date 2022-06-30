"use strict";

window.engine = function() {
  var CODES_MAP = { 37: "left", 38: "up", 39: "right", 40: "down", 65: "left", 87: "up", 68: "right", 83: "down" };

  window.$ = document.querySelector.bind(document);
  var $stack = $("#stack");
  var $stackTrack = $("#stack-track");
  var $timeRemainingTrack = $("#time-remaining-track");
  var $score = $("#score");
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

      startRound();
      updateTimeUsed();
    }, 500);
  }

  function showDirection(direction) {
    for(var i in Pattern.DIRECTIONS) document.body.classList.remove(Pattern.DIRECTIONS[i]);
    document.body.classList.add(direction);
  }

  function startRound() {
    $stack.style.strokeDasharray = ((1262.92 / game.patternLength()) - 4) + " 4";
    $stackTrack.style.strokeDashoffset = ((game.stack() + 1) / game.patternLength()) * 1262.92;
    game.tick(timeNow());
    showDirection(game.roundStarted());
    currentCode = null;
  }

  function updateTimeUsed() {
    game.tick(timeNow());
    timeUsedUpdater = window.requestAnimationFrame(updateTimeUsed);

    $timeRemainingTrack.style.strokeDashoffset = (1482.83 - (game.timeRemainingRatio() * 1482.83));

    if(game.grinding()) document.body.classList.add("grinding");
    else document.body.classList.remove("grinding");

    var newScore = game.score() + game.delta();
    $score.textContent = newScore > 0 ? newScore.toLocaleString() : "";

    if(E.lt(game.timeRemaining(), 0)) setTimeout(onTimeUsed, 0);
  }

  function onTimeUsed() {
    if(!game.canCombo()) {
      endRound();
      return;
    }

    var code = currentCode;
    game.tick(game.finishTime());
    endRound();
    currentCode = code;

    game.input(code);
    game.comboed();
   }

  function onInputStart(event, code) {
    if(document.body.classList.contains("panel-open")) return;

    if(state != "playing") return;
    event.preventDefault();

    if(!currentCode) {
      game.tick(event.timeStamp);
      if(!game.input(code)) {
        endRound();
        return;
      }

      currentCode = code;
    }
    else if(currentCode != code) {
      game.tick(event.timeStamp);
      game.input(null);
      endRound();
    }
  }

  function onInputEnd(event, code) {
    if(document.body.classList.contains("panel-open")) return true;

    if(state == "waiting") {
      event.preventDefault();
      return true;
    }

    if(state != "playing") return false;
    event.preventDefault();

    game.tick(event.timeStamp);

    if(!currentCode || currentCode != code) game.input(null);
    endRound();
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
    var touch = event.changedTouches[0];
    var realTarget = document.elementFromPoint(touch.pageX, touch.pageY);
    onInputEnd(event, realTarget.dataset.direction);
  }

  function endRound() {
    currentCode = null;

    var outcome = game.roundEnded();
    if(outcome) gameOver(outcome);
    else startRound();
  }

  function resetPlayField() {
    showDirection("blank");
    document.body.classList.remove("grinding");
    $score.textContent = "";
    $timeRemainingTrack.style.strokeDashoffset = 0;
    $stackTrack.style.strokeDashoffset = 0;
  }

  function gameOver(outcome) {
    window.cancelAnimationFrame(timeUsedUpdater);

    rejectTouchPlay();
    resetPlayField();
    $("#results-score").textContent = game.score().toLocaleString();
    $("#results-rank").textContent = Ranks.scoreRank(game.score()).humanName;
    $("#results-streak").textContent = game.streak().toLocaleString();
    $("#results-outcome").textContent = Game.formatOutcome(outcome);
    transition("game-over");
    Music.pause();

    Api.submitScore(game, outcome);
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
