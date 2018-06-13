var Game = function() {
  var DIRECTIONS = ["left", "up", "right", "down"];
  var PATTERN_LENGTH = 6;
  var MAX_DUPE_LENGTH = 2;

  function randomDirection() {
    return DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
  }

  function generatePattern() {
    var pattern = null;

    do {
      pattern = [];
      for(var i = 0; i < PATTERN_LENGTH; i++) pattern.push(randomDirection());

      var dupes = false;
      for(var i = MAX_DUPE_LENGTH; i < pattern.length; i++) {
        var sliced = pattern.slice(i - MAX_DUPE_LENGTH, i + 1);

        dupes = sliced.every(function(value) {
          return value == sliced[0];
        });

        if(dupes) break;
      }
    }
    while(dupes);

    return pattern;
  }

  var allowedTime = 1200;
  var score = 0;
  var streak = 0;
  var startTime = null;
  var grinding = false;
  var grindStart = null;
  var direction = null;
  var pattern = generatePattern();
  var correct = false;
  var highPrecisionTimer = (typeof window.performance == "object");

  function now() {
    return highPrecisionTimer ? Math.round(performance.now()) : Date.now();
  }

  function timePassed() {
    if(grindStart) {
      return Math.floor(((now() - grindStart) * 1.5) + (grindStart - startTime));
    }
    else {
      return Math.floor(now() - startTime);
    }
  }

  function timeRemaining() {
    return allowedTime - timePassed();
  }

  function timeRemainingRatio() {
    var time = (allowedTime - timePassed()) / (allowedTime + 0.0);
    if(time < 0) return 0;
    if(time > 1) return 1;
    return time;
  }

  function stack() {
    return streak % pattern.length;
  }

  function maxStacks() {
    return pattern.length;
  }

  function roundStarted() {
    direction = pattern[stack()];
    startTime = now();
    correct = false;
    grinding = false;
    grindStart = null;
    return direction;
  }

  function input(playerDirection) {
    correct = playerDirection == direction;
    return correct;
  }

  function grindStarted() {
    grindStart = now();
    grinding = true;
  }

  function grindDuration() {
    return grindStart ? (now() - grindStart) : 0;
  }

  function grindRatio() {
    if(!grindStart) return 0;
    var ratio = ((now() - grindStart) * 1.5) / (allowedTime - (grindStart - startTime));
    if(ratio < 0) return 0;
    if(ratio > 1) return 1;
    return ratio;
  }

  function delta(time) {
    var delta = (allowedTime - time) + (grindDuration() * 3) + ((streak + 1) * 100);
    if((grindStart != null ? grindStart : time) <= (allowedTime * 0.3)) delta *= 2;
    return delta;
  }

  function roundEnded() {
    var diff = timePassed();
    if(diff < 50 || diff > allowedTime || !correct) return true;

    score += delta(diff);
    streak++;

    if(stack() == 0) {
      if(allowedTime >= 750) allowedTime -= 50;
      else if(allowedTime > 300) allowedTime -= 30;
    }

    return false;
  }

  return {
    grinding: function() {
      return grinding;
    },
    score: function() {
      return score;
    },
    streak: function() {
      return streak;
    },
    stack: stack,
    maxStacks: maxStacks,
    roundStarted: roundStarted,
    input: input,
    timePassed: timePassed,
    timeRemaining: timeRemaining,
    timeRemainingRatio: timeRemainingRatio,
    grindStarted: grindStarted,
    roundEnded: roundEnded,
    delta: delta,
    grindRatio: grindRatio
  };
};