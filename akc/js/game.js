"use strict";

window.Game = function(touch) {
  var initialAllowedTime = 1500;
  var allowedTime = initialAllowedTime;
  var score = 0;
  var streak = 1;
  var startTime = null;
  var direction = null;
  var pattern = new Pattern();
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
    return direction;
  }

  function delta(now) {
    var delta = (initialAllowedTime - (now - startTime)) * Math.max(1, streak / 20);
    if(timeRemainingRatio(now) <= 0.15) delta *= 3;
    else if(timeRemainingRatio(now) <= 0.3) delta *= -2;
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
      diff: timePassed(now)
    });
  }

  function roundEnded(playerDirection, now) {
    if(timePassed(now) > allowedTime) return "timeExceeded";
    if(playerDirection != direction) return "incorrect";

    score += delta(now);
    if(score < 0) score = 0;
    createLogEntry(now);

    allowedTime = Math.max(initialAllowedTime - (75 * Math.floor(score / 20000)), 250);

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
    roundLogs: function() {
      return roundLogs;
    },
    roundStarted: roundStarted,
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