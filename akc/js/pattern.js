"use strict";

window.Pattern = function() {
  var MAX_DUPE_LENGTH = 3;

  function randomDirection() {
    return Pattern.DIRECTIONS[Math.floor(Math.random() * Pattern.DIRECTIONS.length)];
  }

  function addDirection(pattern) {
    loop:
    while(true) {
      pattern.push(randomDirection());

      if(pattern.length <= MAX_DUPE_LENGTH) return;

      for(let i = pattern.length - (MAX_DUPE_LENGTH + 1); i < pattern.length + MAX_DUPE_LENGTH; i++) {
        const sliced = [];
        for(let j = i; j < (i + MAX_DUPE_LENGTH + 1); j++) sliced.push(pattern[j % pattern.length]);

        if(sliced.every(value => value == sliced[0])) {
          pattern.pop();
          continue loop;
        }
      }

      return;
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