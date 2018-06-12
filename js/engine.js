function engine() {
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

  var $ = document.querySelector.bind(document);
  var game = null;
  var input = null;
  var state = null;
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
    Player.play();

    setTimeout(postStarted, alreadyPlayed ? 500 : 1500);
  }

  function postStarted() {
    if(state != "waiting") return;
    transition("playing");
    renderInfo();

    updateTimeUsed();
    startRound();
  }

  function showDirection(direction) {
    for(var i in DIRECTION_CLASSES) document.body.classList.remove(DIRECTION_CLASSES[i]);
    document.body.classList.add(direction);
  }

  function startRound() {
    showDirection(game.roundStarted());
    input.clear();
    roundEndTimeout = window.setTimeout(roundTimedOut, game.allowedTime() + 20);
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
    timeUsedUpdater = window.requestAnimationFrame(updateTimeUsed);

    var ratio = game.timeRemaining();

    var c = 276.46;
    $("#time-remaining-track").style.strokeDashoffset = ((100 - (ratio * 100)) / 100) * c;

    if(game.grinding()) $("#time-remaining-track").classList.add("grind");
    else $("#time-remaining-track").classList.remove("grind");

    $("#score").textContent = nice(game.score() + game.delta(game.timePassed()));
  }

  function renderInfo() {
    $("#score").textContent = nice(game.score());
    $("#stack").textContent = game.maxStacks() - game.stack();
  }

  function endRound() {
    window.clearTimeout(roundEndTimeout);
    input.clear();

    var isGameOver = game.roundEnded();
    renderInfo();

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
    Player.pause();

    alreadyPlayed = true;
  }

  function showPlayerStatus() {
    $("#player-status").classList.remove("enabled", "disabled");
    $("#player-status").classList.add(Player.getEnabled() ? "enabled" : "disabled");
  }

  function updatePlayerStatus() {
    Player.setEnabled(!Player.getEnabled());
    showPlayerStatus();
  }

  input = inputEngine({
    state: function() {
      return state;
    },
    game: function() {
      return game;
    },
    start: start,
    endRound: endRound,
    updatePlayerStatus: updatePlayerStatus
  });

  showPlayerStatus();
  transition("attract");
};

document.addEventListener("DOMContentLoaded", engine);