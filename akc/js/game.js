"use strict";

window.Game = function(touch) {
  var initialAllowedTime = 1200;
  var allowedTime = initialAllowedTime;
  var score = 0;
  var streak = 1;
  var startTime = null;
  var grindStart = null;
  var combo = null;
  var direction = null;
  var pattern = new Pattern();
  var correct = false;
  var roundLogs = [];

  function grindTime(now) {
    return ((now - grindStart) * 2);
  }

  function timePassed(now) {
    if(grindStart) {
      return grindTime(now) + (grindStart - startTime);
    }
    else {
      return now - startTime;
    }
  }

  function finishTime() {
    if(grindStart) {
      return grindStart + (((startTime + allowedTime) - grindStart) / 2.0);
    }
    else {
      return startTime + allowedTime;
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
    correct = false;
    grindStart = null;
    combo = null;
    return direction;
  }

  function input(playerDirection) {
    correct = playerDirection == direction;
    return correct;
  }

  function grindStarted(now) {
    grindStart = now;
  }

  function grindDuration(now) {
    return grindStart ? (now - grindStart) : 0;
  }

  function grindRatio(now) {
    if(!grindStart) return 0;
    var ratio = grindTime(now) / (allowedTime - (grindStart - startTime));
    if(ratio < 0) return 0;
    if(ratio > 1) return 1;
    return ratio;
  }

  function reactionTime() {
    return grindStart - startTime;
  }

  function canCombo() {
    return correct && (direction == pattern.peek());
  }

  function comboed() {
    combo = true;
  }

  function delta(now) {
    if(!grindStart) return 0;

    var delta = ((initialAllowedTime - reactionTime()) + grindDuration(now)) * Math.max(1, streak / 20);
    if(timeRemainingRatio(now) <= 0.1) delta *= 2;
    else if(timeRemainingRatio(now) <= 0.2) delta *= 1.5;

    if(combo) delta *= 2;
    return Math.floor(delta);
  }

  function createLogEntry(now) {
    roundLogs.push({
      allowedTime: allowedTime,
      score: score,
      streak: streak,
      startTime: startTime,
      grindStart: grindStart,
      combo: combo,
      direction: direction,
      now: now,
      diff: timePassed(now)
    });
  }

  function roundEnded(now) {
    if(timePassed(now) > allowedTime) return "timeExceeded";
    if(!correct) return "incorrect";

    score += delta(now);
    createLogEntry(now);

    allowedTime = Math.max(initialAllowedTime - (60 * Math.floor(score / 20000)), 250);

    streak++;
  }

  return {
    touch: function() {
      return touch;
    },
    grinding: function() {
      return !!grindStart;
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
    input: input,
    timeRemaining: timeRemaining,
    timeRemainingRatio: timeRemainingRatio,
    grindStarted: grindStarted,
    finishTime: finishTime,
    canCombo: canCombo,
    comboed: comboed,
    roundEnded: roundEnded,
    delta: delta,
    grindRatio: grindRatio
  };
};

window.Game.SCORING_VERSION = 1;
window.Game.formatOutcome = function(outcome) {
  if(outcome == "incorrect") return "Wrong input";
  if(outcome == "timeExceeded") return "Too slow";
  return "";
};