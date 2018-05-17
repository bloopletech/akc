var Game = function() {
  var DIRECTIONS = ["left", "up", "right", "down"];
  var ROUND_DELAY = 250;

  function randomDirection() {
    return DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];;
  }

  function generatePattern() {
    var pattern = [];
    for(var i = 0; i < 6; i++) pattern.push(randomDirection());
    return pattern;
  }

  var allowedTime = 1300;
  var score = 0;
  var streak = 0;
  var startTime = null;
  var grinding = false;
  var grindStart = null;
  var grindDuration = 0;
  var direction = null;
  var pattern = generatePattern();
  var correct = false;
  var highPrecisionTimer = (typeof window.performance == "object");

  function now() {
    return highPrecisionTimer ? Math.round(performance.now()) : Date.now();
  }

  function timePassed() {
    if(grindStart) {
      return ((now() - grindStart) * 1.5) + (grindStart - startTime);
    }
    else {
      return now() - startTime;
    }
  }

  function timeRemaining() {
    var time = (allowedTime - timePassed()) / (allowedTime + 0.0);
    if(time < 0) return 0;
    if(time > 1) return 1;
    return time;
  }

  function stack() {
    return streak % pattern.length;
  }

  function roundStarted() {
    direction = pattern[stack()];
    startTime = now();
    correct = false;
    grinding = false;
    grindStart = null;
    grindDuration = 0;
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

  function grindEnded() {
    grindDuration += now() - grindStart;
    grinding = false;
  }

  function roundEnded() {
    var diff = Math.floor(timePassed());
    if(diff < 50 || diff > allowedTime || !correct) return true;

    streak++;
    var delta = (allowedTime - diff) + (grindDuration * 5) + (streak * 100);
    if(diff <= (allowedTime * 0.3)) delta *= 2;
    score += delta;

    if(stack() == 0) {
      if(allowedTime >= 750) allowedTime -= 50;
      else if(allowedTime > 300) allowedTime -= 30;
    }

    return false;
  }

  return {
    ROUND_DELAY: ROUND_DELAY,
    allowedTime: function() {
      return allowedTime;
    },
    grinding: function() {
      return grinding;
    },
    score: function() {
      return score;
    },
    streak: function() {
      return streak;
    },
    roundStarted: roundStarted,
    input: input,
    timeRemaining: timeRemaining,
    grindStarted: grindStarted,
    grindEnded: grindEnded,
    roundEnded: roundEnded,
    stack: stack
  };
};