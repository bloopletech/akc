"use strict";

window.Round = function(pattern, allowedTime, streak, score) {
  var direction = pattern.next();
  var startTime = null;
  var grindStart = null;
  var combo = null;
  var correct = false;

  function start(now) {
    startTime = now;
    return direction;
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
    return grindStart && (reactionTime() <= (allowedTime * 0.25));
  }

  function isBoost(now) {
    return grindStart && timeRemainingRatio(now) <= 0.1;
  }

  function delta(now) {
    if(!grindStart) return 0;

    var delta = (window.Game.INITIAL_ALLOWED_TIME - reactionTime()) + grindDuration(now) + (streak * 20);
    if(isFlame(now)) delta += 1000;
    if(isBoost(now)) delta *= 1.5;
    if(combo) delta *= 2;
    return Math.floor(delta);
  }

  function end(now) {
    var diff = timePassed(now);
    if(diff < 50 || diff > allowedTime || !correct) return true;

    score += delta(now);

    if(streak % 16 == 0) {
      if(allowedTime >= 750) allowedTime -= 60;
      else if(allowedTime > 300) allowedTime -= 30;
    }

    return false;
  }
  
  function next(now, allowedTime) {
    return new Round(
      pattern,
      now,
      allowedTime,
      streak + 1
    );
  }

  return {
    pattern: function() {
      return pattern;
    },
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
      return round().pattern().length();
    },
    input: input,
    timeRemaining: timeRemaining,
    timeRemainingRatio: timeRemainingRatio,
    grindStarted: grindStarted,
    finishTime: finishTime,
    comboed: comboed,
    delta: delta,
    grindRatio: grindRatio,
    timePassed: timePassed,
    next: next
  };
};

window.Round.first = function(now) {
  return new Round(
    new Pattern(),
    window.Round.INITIAL_ALLOWED_TIME,
    1
  );
};

window.Round.INITIAL_ALLOWED_TIME = 1200;
