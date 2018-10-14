"use strict";

window.Game = function(touch) {
  var allowedTime = 1200;
  var score = 0;
  var rounds = [];

  function round() {
    return rounds[rounds.length - 1];
  }

  function roundStarted(now) {
    if(rounds.length == 0) rounds.push(window.Round.first(now, window.Game.INITIAL_ALLOWED_TIME));
    else rounds.push(round().next(now, allowedTime));
    return round().direction();
  }

  function roundEnded(now) {
    var diff = round().timePassed(now);
    if(diff < 50 || diff > allowedTime || !round().correct()) return true;

    score += round().delta(now);

    if(round().streak() % 16 == 0) {
      if(allowedTime >= 750) allowedTime -= 60;
      else if(allowedTime > 300) allowedTime -= 30;
    }

    return false;
  }

  return {
    touch: function() {
      return touch;
    },
    score: function() {
      return score;
    },
    maxStacks: function() {
      return round().pattern().length();
    },
    roundStarted: roundStarted,
    roundEnded: roundEnded,
    round: round
  };
};

window.Game.INITIAL_ALLOWED_TIME = 1200;
window.Game.SCORING_VERSION = 1;