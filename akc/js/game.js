"use strict";

window.Game = function(touch) {
  var MAX_DUPE_LENGTH = 3;

  function randomDirection() {
    return Game.DIRECTIONS[Math.floor(Math.random() * Game.DIRECTIONS.length)];
  }

  function addDirection(pattern) {
    while(true) {
      pattern.push(randomDirection());

      var sliced = pattern.slice(-(MAX_DUPE_LENGTH + 1));
      if(sliced.length < MAX_DUPE_LENGTH) return;

      var dupes = sliced.every(function(value) {
        return value == sliced[0];
      });

      if(dupes) pattern.pop();
      else return;
    }
  }

  function addDirections(pattern, count) {
    for(var i = 0; i < count; i++) addDirection(pattern);
  }

  var initialAllowedTime = 1200;
  var allowedTime = initialAllowedTime;
  var score = 0;
  var streak = 0;
  var startTime = null;
  var grindStart = null;
  var combo = null;
  var stack = 0;
  var cycles = 0;
  var direction = null;
  var pattern = [];
  addDirections(pattern, 5);
  var correct = false;

  function nextDirection() {
    var next = pattern[stack];

    stack++;
    if(stack >= pattern.length) {
      stack = 0;
      cycles++;
      if(cycles == 4) {
        cycles = 0;
        addDirections(pattern, 1);
        if(allowedTime >= 750) allowedTime -= 75;
        else if(allowedTime > 300) allowedTime -= 30;
      }
    }

    return next;
  }

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
    var time = (allowedTime - timePassed(now)) / (allowedTime + 0.0);
    if(time < 0) return 0;
    if(time > 1) return 1;
    return time;
  }

  function roundStarted(now) {
    direction = nextDirection();
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

  function comboed() {
    combo = true;
  }

  function isFlame(now) {
    return grindStart && (reactionTime() <= (allowedTime * 0.3));
  }

  function isBoost(now) {
    return grindStart && timeRemainingRatio(now) <= 0.1;
  }

  function delta(now) {
    if(!grindStart) return 0;

    var delta = (initialAllowedTime - reactionTime()) + (grindDuration(now) * 3) + (streak * 10);
    if(isFlame(now)) delta *= 3;
    if(isBoost(now)) delta *= 3;
    if(combo) delta *= 2;
    return Math.floor(delta);
  }

  function roundEnded(now) {
    var diff = timePassed(now);
    if(diff < 50 || diff > allowedTime || !correct) return true;

    score += delta(now);
    streak++;

    return false;
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
      return stack;
    },
    maxStacks: function() {
      return pattern.length;
    },
    roundStarted: roundStarted,
    input: input,
    timeRemaining: timeRemaining,
    timeRemainingRatio: timeRemainingRatio,
    grindStarted: grindStarted,
    finishTime: finishTime,
    comboed: comboed,
    roundEnded: roundEnded,
    delta: delta,
    grindRatio: grindRatio
  };
};

window.Game.DIRECTIONS = ["left", "up", "right", "down"];
window.Game.SCORING_VERSION = 1;