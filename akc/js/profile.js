"use strict";

window.Profile = (function() {
  var username = null;

  function accessUsername() {
    if(arguments.length == 1) username = arguments[0];
    else return username;
  }

  function load(callback) {
    Api.loadProfile(function(data) {
      username = data.username;
      //data

      callback();
    });
  }

  function save(success, failure) {
    Api.saveProfile(username, success, failure);
  }

  if(Api.token() != null) load(function() {});

  return {
    load: load,
    save: save,
    username: accessUsername
  };
})();
