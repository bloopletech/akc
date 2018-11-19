"use strict";

window.User = (function() {
  var TOKEN_KEY = "user.token";
  Setting.init(TOKEN_KEY, null, "string");

  function withToken(callback) {
    var token = Setting(TOKEN_KEY);
    if(token != null) return callback(token);

    Api.createUser(function(data) {
      Setting(TOKEN_KEY, data.token);
      callback(data.token);
    });
  }

  return {
    withToken: withToken
  };
})();
