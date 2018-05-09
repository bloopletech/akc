function Engine(endedCallback) {
  this.game = new Game();
  this.CODES_MAP = { 37: "left", 38: "up", 39: "right", 40: "down" };
  this.DIRECTION_CLASSES = this.game.DIRECTIONS.concat("blank");
  this.RANKS = {
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
  this.endedCallback = endedCallback;
  this.currentKeyCode = null;
  this.currentTouchCode = null;
  this.alreadyPlayed = false;
  this.transition("attract");
}

Engine.prototype.transition = function(state) {
  this.state = state;
  document.body.classList.remove("attract", "waiting", "playing", "game-over");
  document.body.classList.add(state);
}

Engine.prototype.start = function() {
  this.transition("waiting");
  this.game.start();

  setTimeout(this.postStarted.bind(this), this.alreadyPlayed ? 500 : 1500);
}

Engine.prototype.postStarted = function() {
  if(this.state != "waiting") return;
  this.transition("playing");
  $("#score").textContent = "0";
  $("#streak").textContent = "0";

  this.updateTimeUsed();
  this.startRound();
}

Engine.prototype.showDirection = function(direction) {
  for(var i in this.DIRECTION_CLASSES) document.body.classList.remove(this.DIRECTION_CLASSES[i]);
  document.body.classList.add(direction);
}

Engine.prototype.startRound = function() {
  this.showDirection(this.game.roundStarted());

  this.currentKeyCode = null;
  this.currentTouchCode = null;
  this.roundEndTimeout = window.setTimeout(this.roundTimedOut.bind(this), this.game.allowedTime + 20);
}

Engine.prototype.roundTimedOut = function() {
  this.game.input();
  this.endRound();
}

Engine.prototype.scoreRank = function() {
  var score = this.game.score;

  var currentRank = null;
  for(var i in this.RANKS) {
    var rank = this.RANKS[i];
    if(score >= rank.minScore) currentRank = rank;
  }

  return currentRank;
}

Engine.prototype.updateTimeUsed = function() {
  this.timeUsedUpdater = window.requestAnimationFrame(this.updateTimeUsed.bind(this));

  var ratio = this.game.timeRemaining();

  var c = 276.46;
  $("#time-remaining-track").style.strokeDashoffset = ((100 - (ratio * 100)) / 100) * c;

  if(this.game.grinding) $("#time-remaining-track").classList.add("grind");
  else $("#time-remaining-track").classList.remove("grind");
}

Engine.prototype.onKeyDown = function(event) {
  if(this.state == "waiting") {
    event.preventDefault();
    return;
  }

  if(this.state == "playing") {
    event.preventDefault();

    if(!this.currentKeyCode) {
      if(!this.game.input(this.CODES_MAP[event.keyCode])) {
        this.endRound();
        return;
      }

      this.currentKeyCode = event.keyCode;
      this.game.grindStarted();
    }
    else if(this.currentKeyCode != event.keyCode) {
      this.game.input();
      this.endRound();
    }

    return;
  }

  if(event.keyCode == 32) {
    event.preventDefault();
    this.start();
  }
}

Engine.prototype.onKeyUp = function(event) {
  if(this.state == "waiting") {
    event.preventDefault();
    return;
  }

  if(this.state == "playing") {
    if(!this.currentKeyCode || this.currentKeyCode != event.keyCode) {
      this.game.input();
      this.endRound();
      return;
    }
    else {
      this.currentKeyCode = null;
      this.game.grindEnded();
      this.endRound();
      return;
    }
  }
}

Engine.prototype.onTouchStart = function(event) {
  if(this.state == "waiting") {
    event.preventDefault();
    return;
  }

  if(this.state == "playing") {
    event.preventDefault();

    var code = event.target.dataset.direction;

    if(!this.currentTouchCode) {
      if(!this.game.input(code)) {
        this.endRound();
        return;
      }

      this.currentTouchCode = code;
      this.game.grindStarted();
    }
    else if(this.currentTouchCode != code) {
      this.game.input();
      this.endRound();
    }

    return;
  }
}

Engine.prototype.onTouchEnd = function(event) {
  if(this.state == "waiting") {
    event.preventDefault();
    return;
  }

  if(this.state == "playing") {
    var code = event.target.dataset.direction;

    if(!this.currentTouchCode || this.currentTouchCode != code) {
      this.game.input();
      this.endRound();
      return;
    }
    else {
      this.currentTouchCode = null;
      this.game.grindEnded();
      this.endRound();
      return;
    }
  }
}

Engine.prototype.endRound = function() {
  window.clearTimeout(this.roundEndTimeout);
  this.currentKeyCode = null;
  this.currentTouchCode = null;

  var gameOver = this.game.roundEnded();
  $("#score").textContent = this.nice(this.game.score);
  $("#streak").textContent = this.game.streak;

  if(gameOver) this.gameOver();
  else this.startRound();
}

Engine.prototype.nice = function(num) {
	var x = num + '';
	var rgx = /(\d+)(\d{3})/;
	while(rgx.test(x)) x = x.replace(rgx, '$1' + ',' + '$2');
	return x;
};

Engine.prototype.gameOver = function() {
  window.cancelAnimationFrame(this.timeUsedUpdater);

  this.showDirection("blank");
  $("#results-score").textContent = this.nice(this.game.score);
  $("#results-rank").textContent = this.scoreRank().humanName;
  $("#results-streak").textContent = this.game.streak;
  this.transition("game-over");

  this.alreadyPlayed = true;
  this.endedCallback(this.game.score);
}
