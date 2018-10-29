"use strict";

window.Api = (function() {
  var endpoint = null;
  if(location.host == "akc.link") endpoint = "https://api.akc.link/";
  else if(location.host == "akc.dokku.bloople.net") endpoint = "https://akc-api.dokku.bloople.net";
  else endpoint = "http://localhost:3000/";

  function serialize(params) {
    return "?" + Object.keys(params).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');
  }

  function request(options) {
    var http = new XMLHttpRequest();
    var requestType = options.type || "GET";
    var url = options.url;

    var data = options.data || {};
    if(options.token != null) data.access_token = options.token;

    if(requestType == "GET") url += serialize(data);

    http.open(requestType, url);

    http.onreadystatechange = function() {
      if(http.readyState === 4 && http.status === 200) {
        var success = options.success;
        if(success) success(JSON.parse(http.responseText));
      }
    };

    http.setRequestHeader("Accept", "application/json");
    http.setRequestHeader("Content-Type", "text/plain");

    if(requestType != "GET" && data != {}) http.send(JSON.stringify(data));
    else http.send();
  }

  function createUser(success) {
    request({
      type: "POST",
      url: endpoint + "users",
      success: success
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

    User.withToken(function(token) {
      request({
        type: "POST",
        url: endpoint + "my/scores",
        token: token,
        data: { "score": scoreData },
        success: success
      });
    });
  }

  function myScores(success) {
    User.withToken(function(token) {
      request({
        url: endpoint + "my/scores",
        token: token,
        success: success
      });
    });
  }

  return {
    createUser: createUser,
    submitScore: submitScore,
    myScores: myScores
  };
})();
