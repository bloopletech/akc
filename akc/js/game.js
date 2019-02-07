"use strict";

window.Game = function(touch) {
  var initialAllowedTime = 1500;
  var allowedTime = initialAllowedTime;
  var score = 0;
  var streak = 1;
  var startTime = null;
  var grindStart = null;
  var combo = null;
  var quickResponses = 0;
  var direction = null;
  var pattern = new Pattern();
  var correct = false;
  var roundLogs = [];

  function grindTime(now) {
    return ((now - grindStart) * 1.7);
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
      return grindStart + (((startTime + allowedTime) - grindStart) / 1.7);
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

  function input(playerDirection, now) {
    correct = playerDirection == direction;
    if(correct) grindStart = now;
    return correct;
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

    return Math.floor(delta);
  }

  function createLogEntry(now) {
    return {
      allowedTime: allowedTime,
      score: score,
      streak: streak,
      startTime: startTime,
      grindStart: grindStart,
      combo: combo,
      direction: direction,
      now: now,
      diff: timePassed(now),
      delta: null
    };
  }

  function roundEnded(now) {
    var logEntry = createLogEntry(now);
    roundLogs.push(logEntry);

    if(timePassed(now) > allowedTime) return "timeExceeded";
    if(!correct) return "incorrect";

    var dx = delta(now);
    score += dx;
    logEntry.score = score;
    logEntry.delta = dx;

    if(streak % (pattern.maxStacks() * 2) == 0) {
      if(allowedTime >= 870) allowedTime -= 70;
      else if(allowedTime > 300) allowedTime -= 30;
    }
    else if(streak <= pattern.maxStacks() && reactionTime() <= 600) {
      quickResponses++;
    }
    if(streak == pattern.maxStacks()) allowedTime -= Math.max(3, quickResponses) * 50;

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
    finishTime: finishTime,
    canCombo: canCombo,
    comboed: comboed,
    roundEnded: roundEnded,
    delta: delta,
    grindRatio: grindRatio
  };
};

window.Game.SCORING_VERSION = 2;
window.Game.formatOutcome = function(outcome) {
  if(outcome == "incorrect") return "Wrong input";
  if(outcome == "timeExceeded") return "Too slow";
  return "";
};