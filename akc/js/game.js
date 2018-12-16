"use strict";

window.Game = function(touch) {
  var initialAllowedTime = 1500;
  var allowedTime = initialAllowedTime;
  var score = 0;
  var streak = 1;
  var startTime = null;
  var direction = null;
  var pattern = new Pattern();
  var correct = false;
  var outcome = null;
  var roundLogs = [];

  function timePassed(now) {
    var diff = now - startTime;
    return diff * ((diff / allowedTime) + 1);
  }

  function timeRemaining(now) {
    return allowedTime - timePassed(now);
  }

  function timeRemainingRatio(now) {
    var time = timeRemaining(now) / allowedTime;
    if(time < 0) return 0;
    if(time > 1) return 1;
    return time;
  }

  function roundStarted(now) {
    direction = pattern.next();
    startTime = now;
    correct = false;
    return direction;
  }

  function input(playerDirection) {
    correct = playerDirection == direction;
    return correct;
  }

  function isBoost(now) {
    return timeRemainingRatio(now) <= 0.1;
  }

  function delta(now) {
    var delta = (initialAllowedTime - (now - startTime)) * Math.max(1, streak / 10);
    if(isBoost(now)) delta *= 1.5;
    return Math.floor(delta);
  }

  function createLogEntry(now) {
    roundLogs.push({
      allowedTime: allowedTime,
      score: score,
      streak: streak,
      startTime: startTime,
      direction: direction,
      now: now,
      diff: timePassed(now),
      outcome: outcome
    });
  }

  function updateOutcome(now) {
    var diff = timePassed(now);
    if(diff > allowedTime) outcome = "timeExceeded";
    else if(!correct) outcome = "incorrect";
  }

  function roundEnded(now) {
    if(outcome) return;

    updateOutcome(now);
    if(!outcome) score += delta(now);
    createLogEntry(now);

    if(outcome) return;

    if(streak % (pattern.maxStacks() * 2) == 0) {
      if(allowedTime >= 750) allowedTime -= 75;
      else if(allowedTime > 300) allowedTime -= 30;
    }

    streak++;
  }

  return {
    touch: function() {
      return touch;
    },
    score: function() {
      return score;
    },
    streak: function() {
      return streak;
    },
    stack: function() {
      return pattern.stack();
    },
    maxStacks: function() {
      return pattern.maxStacks();
    },
    outcome: function() {
      return outcome;
    },
    roundLogs: function() {
      return roundLogs;
    },
    roundStarted: roundStarted,
    input: input,
    timeRemaining: timeRemaining,
    timeRemainingRatio: timeRemainingRatio,
    roundEnded: roundEnded,
    delta: delta
  };
};

window.Game.SCORING_VERSION = 1;
window.Game.formatOutcome = function(outcome) {
  if(outcome == "incorrect") return "Wrong input";
  if(outcome == "timeExceeded") return "Too slow";
  return "";
};