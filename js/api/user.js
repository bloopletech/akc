"use strict";

window.User = (function() {
  function tokenKey() {
    return "user.token";
  }

  function getToken() {
    return localStorage[tokenKey()];
  }

  function setToken(token) {
    localStorage[tokenKey()] = token;
  }

  function withToken(callback) {
    var token = getToken();
    if(token != null) return callback(token);

    Api.createUser(function(data) {
      setToken(data.token);
      callback(data.token);
    });
  }

  return {
    withToken: withToken
  };
})();
