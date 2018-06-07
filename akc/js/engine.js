var Engine = function(endedCallback) {
  var CODES_MAP = { 37: "left", 38: "up", 39: "right", 40: "down" };
  var DIRECTION_CLASSES = ["left", "up", "right", "down"];
  var RANKS = {
    bronze: {
      minScore: 0,
      humanName: "Bronze",
      class: "bronze"
    },
    silver: {
      minScore: 50000,
      humanName: "Silver",
      class: "silver"
    },
    gold: {
      minScore: 80000,
      humanName: "Gold",
      class: "gold"
    },
    platinum: {
      minScore: 100000,
      humanName: "Platinum",
      class: "platinum"
    },
    diamond: {
      minScore: 1100000,
      humanName: "Diamond",
      class: "diamond"
    },
    vanadium: {
      minScore: 120000,
      humanName: "Vanadium",
      class: "vanadium"
    },
    strontium: {
      minScore: 130000,
      humanName: "Strontium",
      class: "strontium"
    }
  };

  var game = null;
  var state = null;
  var currentKeyCode = null;
  var currentTouchCode = null;
  var alreadyPlayed = false;
  var roundEndTimeout = null;

  function transition(newState) {
    state = newState;
    document.body.classList.remove("attract", "waiting", "playing", "game-over");
    document.body.classList.add(state);
  }

  function start() {
    transition("waiting");
    game = new Game();

    setTimeout(postStarted.bind(this), alreadyPlayed ? 500 : 1500);
  }

  function postStarted() {
    if(state != "waiting") return;
    transition("playing");
    $("#score").textContent = "0";
    updateStack();

    updateTimeUsed();
    startRound();
  }

  function showDirection(direction) {
    for(var i in DIRECTION_CLASSES) document.body.classList.remove(DIRECTION_CLASSES[i]);
    document.body.classList.add(direction);
  }

  function startRound() {
    showDirection(game.roundStarted());

    currentKeyCode = null;
    currentTouchCode = null;

    roundEndTimeout = window.setTimeout(roundTimedOut.bind(this), game.allowedTime() + 20);
  }


  function roundTimedOut() {
    game.input();
    endRound();
  }

  function scoreRank() {
    var score = game.score();

    var currentRank = null;
    for(var i in RANKS) {
      var rank = RANKS[i];
      if(score >= rank.minScore) currentRank = rank;
    }

    return currentRank;
  }

  function updateTimeUsed() {
    timeUsedUpdater = window.requestAnimationFrame(updateTimeUsed.bind(this));

    var ratio = game.timeRemaining();

    var c = 276.46;
    $("#time-remaining-track").style.strokeDashoffset = ((100 - (ratio * 100)) / 100) * c;

    if(game.grinding()) $("#time-remaining-track").classList.add("grind");
    else $("#time-remaining-track").classList.remove("grind");
  }

  function onKeyDown(event) {
    if(state == "waiting") {
      event.preventDefault();
      return;
    }

    if(state == "playing") {
      event.preventDefault();

      if(!currentKeyCode) {
        if(!game.input(CODES_MAP[event.keyCode])) {
          endRound();
          return;
        }

        currentKeyCode = event.keyCode;
        game.grindStarted();
      }
      else if(currentKeyCode != event.keyCode) {
        game.input();
        endRound();
      }

      return;
    }

    if(event.keyCode == 32) {
      event.preventDefault();
      start();
    }
  }

  function onKeyUp(event) {
    if(state == "waiting") {
      event.preventDefault();
      return;
    }

    if(state == "playing") {
      if(!currentKeyCode || currentKeyCode != event.keyCode) {
        game.input();
        endRound();
        return;
      }
      else {
        currentKeyCode = null;
        game.grindEnded();
        endRound();
        return;
      }
    }
  }

  function onTouchStart(event) {
    if(state == "waiting") {
      event.preventDefault();
      return;
    }

    if(state == "playing") {
      event.preventDefault();

      var code = event.target.dataset.direction;

      if(!currentTouchCode) {
        if(!game.input(code)) {
          endRound();
          return;
        }

        currentTouchCode = code;
        game.grindStarted();
      }
      else if(currentTouchCode != code) {
        game.input();
        endRound();
      }

      return;
    }
  }

  function onTouchEnd(event) {
    if(state == "waiting") {
      event.preventDefault();
      return;
    }

    if(state == "playing") {
      var code = event.target.dataset.direction;

      if(!currentTouchCode || currentTouchCode != code) {
        game.input();
        endRound();
        return;
      }
      else {
        currentTouchCode = null;
        game.grindEnded();
        endRound();
        return;
      }
    }
  }

  function updateStack() {
    var stack = game.stack() + 1;
    var content = "";
    var emoji = game.maxStacks() ? "❤️" : "🖤";
    for(var i = 0; i < stack; i++) content += emoji;
    $("#stack").textContent = content;
  }

  function endRound() {
    window.clearTimeout(roundEndTimeout);
    currentKeyCode = null;
    currentTouchCode = null;

    var isGameOver = game.roundEnded();
    $("#score").textContent = nice(game.score());
    updateStack();

    if(isGameOver) gameOver();
    else startRound();
  }

  function nice(num) {
    var x = num + '';
    var rgx = /(\d+)(\d{3})/;
    while(rgx.test(x)) x = x.replace(rgx, '$1' + ',' + '$2');
    return x;
  }

  function gameOver() {
    window.cancelAnimationFrame(timeUsedUpdater);

    showDirection("blank");
    $("#results-score").textContent = nice(game.score());
    $("#results-rank").textContent = scoreRank().humanName;
    $("#results-streak").textContent = game.streak();
    transition("game-over");

    alreadyPlayed = true;
    endedCallback(game.score());
  }

  function init() {
    window.$ = document.querySelector.bind(document);

    var engine = new Engine(function() {});

    if(window.innerWidth >= 460) {
      window.addEventListener("keydown", function(event) {
        engine.onKeyDown(event);
      });
      window.addEventListener("keyup", function(event) {
        engine.onKeyUp(event);
      });
    }
    else {
      window.addEventListener("touchstart", function(event) {
        engine.onTouchStart(event);
      });
      window.addEventListener("touchend", function(event) {
        engine.onTouchEnd(event);
      });
    }

    document.body.addEventListener("click", function(e) {
      if(e.target.matches(".play")) engine.start();
      else if(e.target.matches("#settings")) showBack;
      else if(e.target.matches("#done")) showFront;
    });

    transition("attract");
  }

  return {
    init: init,
    start: start,
    onKeyDown: onKeyDown,
    onKeyUp: onKeyUp,
    onTouchStart: onTouchStart,
    onTouchEnd: onTouchEnd
  }
};

document.addEventListener("DOMContentLoaded", function() {
  (new Engine()).init();
});