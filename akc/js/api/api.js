"use strict";

window.Api = (function() {
  var TOKEN_KEY = "user.token";
  Setting.init(TOKEN_KEY, null, "string");

  function accessToken() {
    return Setting(TOKEN_KEY);
  }

  function withToken(callback) {
    var token = accessToken();
    if(token != null) return callback(token);

    createUser(function(data) {
      Setting(TOKEN_KEY, data.token);
      callback(data.token);
    });
  }

  function createUser(success) {
    Client.request({
      type: "POST",
      path: "users",
      success: success
    });
  }

  function loadProfile(success) {
    withToken(function(token) {
      Client.request({
        type: "GET",
        path: "my/profile",
        token: token,
        success: success
      });
    });
  }

  function saveProfile(username, success, failure) {
    withToken(function(token) {
      Client.request({
        type: "POST",
        path: "my/profile",
        token: token,
        data: {
          "username": username
        },
        success: success,
        failure: failure
      });
    });
  }

  function submitScore(game, success) {
    if(game.score() == 0) return;

    var scoreData = {
      "scoring_version": Game.SCORING_VERSION,
      "mode": game.touch() ? "touch" : "keyboard",
      "value": game.score(),
      "streak": game.streak(),
      "rank": Ranks.scoreRank(game.score()).humanName,
      "outcome": game.outcome(),
      "rounds": game.roundLogs()
    };

    withToken(function(token) {
      Client.request({
        type: "POST",
        path: "my/scores",
        token: token,
        data: { "score": scoreData },
        success: success
      });
    });
  }

  function loadScores(success) {
    withToken(function(token) {
      Client.request({
        path: "my/scores",
        token: token,
        success: success
      });
    });
  }

  function loadTopScores(success) {
    Client.request({
      path: "scores",
      success: success
    });
  }

  return {
    token: accessToken,
    loadProfile: loadProfile,
    saveProfile: saveProfile,
    submitScore: submitScore,
    loadScores: loadScores,
    loadTopScores: loadTopScores
  };
})();
