"use strict";

window.Pattern = function() {
  var MAX_DUPE_LENGTH = 3;

  function randomDirection() {
    return Pattern.DIRECTIONS[Math.floor(Math.random() * Pattern.DIRECTIONS.length)];
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

  var stack = 0;
  var pattern = [];
  addDirections(pattern, 8);

  function next() {
    var next = pattern[stack];

    stack++;
    if(stack >= pattern.length) stack = 0;

    return next;
  }

  return {
    peek: function() {
      return pattern[stack];
    },
    stack: function() {
      return stack;
    },
    length: function() {
      return pattern.length;
    },
    next: next
  };
};

window.Pattern.DIRECTIONS = ["left", "up", "right", "down"];