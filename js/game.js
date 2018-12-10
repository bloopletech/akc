"use strict";

window.Game = function(touch) {
  var initialAllowedTime = 1200;
  var allowedTime = initialAllowedTime;
  var score = 0;
  var streak = 1;
  var startTime = null;
  var grindStart = null;
  var direction = null;
  var pattern = new Pattern();
  var correct = false;
  var outcome = null;
  var roundLogs = [];

  function grindTime(now) {
    return ((now - grindStart) * 2);
  }

  function timePassed(now) {
    if(now > grindStart) {
      return grindTime(now) + (grindStart - startTime);
    }
    else {
      return now - startTime;
    }
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
    grindStart = startTime + Math.ceil(allowedTime / 2);
    correct = false;
    return direction;
  }

  function input(playerDirection) {
    correct = playerDirection == direction;
    return correct;
  }

  function grindDuration(now) {
    return Math.max(now - grindStart, 0);
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
    if(!correct) outcome = "incorrect";
    else if(diff > allowedTime) outcome = "timeExceeded";
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