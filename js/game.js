window.Game = function(touch) {
  var DIRECTIONS = ["left", "up", "right", "down"];
  var MAX_DUPE_LENGTH = 2;

  function randomDirection() {
    return DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
  }

  function generatePattern() {
    var pattern = null;

    do {
      pattern = [];
      for(var i = 0; i < 7; i++) pattern.push(randomDirection());

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

  var allowedTime = touch ? 1500 : 1200;
  var score = 0;
  var streak = 0;
  var startTime = null;
  var grindStart = null;
  var stack = 0;
  var cycles = 0;
  var direction = null;
  var pattern = generatePattern();
  var correct = false;

  function nextDirection() {
    var next = pattern[stack];

    stack++;
    if(stack >= pattern.length) {
      stack = 0;
      cycles++;
      if(cycles % 2 == 0) pattern.push(randomDirection());
    }

    return next;
  }

  function timePassed(now) {
    if(grindStart) {
      return ((now - grindStart) * 1.5) + (grindStart - startTime);
    }
    else {
      return now - startTime;
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

  function maxStacks() {
    return pattern.length;
  }

  function roundStarted(now) {
    direction = nextDirection();
    startTime = now;
    correct = false;
    grindStart = null;
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
    var ratio = ((now - grindStart) * 1.5) / (allowedTime - (grindStart - startTime));
    if(ratio < 0) return 0;
    if(ratio > 1) return 1;
    return ratio;
  }

  function delta(now) {
    var delta = (allowedTime - timePassed(now)) + (grindDuration(now) * 3) + ((streak + 1) * 100);
    if((grindStart != null ? (grindStart - startTime) : timePassed(now)) <= (allowedTime * 0.3)) delta *= 2;
    return Math.floor(delta);
  }

  function roundEnded(now) {
    var diff = timePassed(now);
    if(diff < 50 || diff > allowedTime || !correct) return true;

    score += delta(now);
    streak++;

    if(stack == 0) {
      if(allowedTime >= 750) allowedTime -= 60;
      else if(allowedTime > 300) allowedTime -= 30;
    }

    return false;
  }

  return {
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
    maxStacks: maxStacks,
    roundStarted: roundStarted,
    input: input,
    timeRemaining: timeRemaining,
    timeRemainingRatio: timeRemainingRatio,
    grindStarted: grindStarted,
    roundEnded: roundEnded,
    delta: delta,
    grindRatio: grindRatio
  };
};