"use strict";

window.Game = function(touch) {
  var initialAllowedTime = 1500;
  var allowedTime = initialAllowedTime;
  var score = 0;
  var streak = 1;
  var now = null;
  var startTime = null;
  var elapsed = null;
  var grindStart = null;
  var combo = null;
  var quickResponses = 0;
  var direction = null;
  var pattern = new Pattern();
  var correct = false;
  var roundLogs = [];

  function tick(nextNow) {
    now = nextNow;
    elapsed = now - startTime;
  }

  function grindTime() {
    return (elapsed - grindStart) * 1.7;
  }

  function timePassed() {
    if(grindStart) return grindTime() + grindStart;
    return elapsed;
  }

  function finishTime() {
    if(grindStart) return grindStart + ((allowedTime - grindStart) / 1.7);
    else return allowedTime;
  }

  function timeRemaining() {
    return allowedTime - timePassed();
  }

  function timeRemainingRatio() {
    var time = timeRemaining() / allowedTime;
    if(time < 0) return 0;
    if(time > 1) return 1;
    return time;
  }

  function roundStarted() {
    direction = pattern.next();
    startTime = now;
    correct = false;
    grindStart = null;
    combo = null;
    return direction;
  }

  function input(playerDirection) {
    correct = playerDirection == direction;
    if(correct) grindStart = elapsed;
    return correct;
  }

  function grindDuration() {
    return grindStart ? elapsed - grindStart : 0;
  }

  function reactionTime() {
    return grindStart;
  }

  function canCombo() {
    return correct && direction == pattern.peek();
  }

  function comboed() {
    combo = true;
  }

  function delta() {
    if(!grindStart) return 0;

    var delta = ((initialAllowedTime - reactionTime()) + grindDuration()) * Math.max(1, streak / 20);
    if(timeRemainingRatio() <= 0.1) delta *= 2;
    else if(timeRemainingRatio() <= 0.2) delta *= 1.5;

    return Math.floor(delta);
  }

  function createLogEntry() {
    return {
      allowedTime: allowedTime,
      score: score,
      streak: streak,
      startTime: startTime,
      grindStart: grindStart,
      combo: combo,
      direction: direction,
      now: now,
      diff: timePassed(),
      delta: null
    };
  }

  function updateAllowedTime() {
    var length = pattern.length();

    if(streak <= length && reactionTime() <= 600) quickResponses++;

    if(streak == length) {
      allowedTime -= Math.max(3, quickResponses) * 35;
    }
    else if(streak % (length * 2) == length) {
      if(allowedTime >= 850) allowedTime -= 65;
      else if(allowedTime > 300) allowedTime -= 30;
    }
  }

  function roundEnded() {
    var logEntry = createLogEntry();
    roundLogs.push(logEntry);

    if(E.gt(timePassed(), allowedTime)) return "timeExceeded";
    if(!correct) return "incorrect";

    var dx = delta();
    score += dx;
    logEntry.score = score;
    logEntry.delta = dx;

    updateAllowedTime();
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
    patternLength: function() {
      return pattern.length();
    },
    roundLogs: function() {
      return roundLogs;
    },
    tick: tick,
    roundStarted: roundStarted,
    input: input,
    timeRemaining: timeRemaining,
    timeRemainingRatio: timeRemainingRatio,
    finishTime: finishTime,
    canCombo: canCombo,
    comboed: comboed,
    roundEnded: roundEnded,
    delta: delta
  };
};

window.Game.SCORING_VERSION = 2;
window.Game.formatOutcome = function(outcome) {
  if(outcome == "incorrect") return "Wrong input";
  if(outcome == "timeExceeded") return "Too slow";
  return "";
};