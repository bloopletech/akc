"use strict";

window.Api = (function() {
  var endpoint = null;
  if(location.host == "akc.link") endpoint = "https://api.akc.link/";
  else if(location.host == "akc.dokku.bloople.net") endpoint = "https://akc-api.dokku.bloople.net";
  else endpoint = "http://localhost:3000/";

  function request(options) {
    var http = new XMLHttpRequest();

    http.open(options.type || "GET", options.url);

    http.onreadystatechange = function() {
      if(http.readyState === 4 && http.status === 200) {
        var success = options.success;
        if(success) success(JSON.parse(http.responseText));
      }
    };

    http.setRequestHeader("Accept", "application/json");
    http.setRequestHeader("Content-Type", "text/plain");

    if(options.token != null && options.data) options.data.access_token = options.token;

    if(options.data) http.send(JSON.stringify(options.data));
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
    var scoreData = {
      "mode": game.touch() ? "touch" : "keyboard",
      "value": game.score(),
      "streak": game.streak(),
      "rank": Ranks.scoreRank(game.score()).humanName
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

  return {
    createUser: createUser,
    submitScore: submitScore
  };
})();
