"use strict";

window.Profile = (function() {
  var token = null;
  var username = null;

  function accessUsername() {
    if(arguments.length == 1) username = arguments[0];
    else return username;
  }

  function load(callback) {
    if(token != null) return callback();

    Api.loadProfile(function(data) {
      token = data.token;
      username = data.username;
      //data

      callback();
    });
  }

  function save(success, failure) {
    Api.saveProfile(username, success, failure);
  }

  document.addEventListener("DOMContentLoaded", function() {
    load(function() {
      $("#menu-username").innerText = username;
    });
  });

  return {
    token: function() {
      return token;
    },
    load: load,
    save: save,
    username: accessUsername
  };
})();


