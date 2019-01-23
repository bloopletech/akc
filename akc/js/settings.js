"use strict";

window.Settings = {
  define: function(key, type, defaultValue) {
    if(type != "boolean" && type != "integer" && type != "float" && type != "string") throw "Invalid setting type";

    var getter = function() {
      var value = localStorage[key];

      if(type == "boolean") return value == "true";
      else if(type == "integer") return parseInt(value);
      else if(type == "float") return parseFloat(value);
      else return value;
    }

    var setter = function(value) {
      if(value == null) delete localStorage[key];
      else localStorage[key] = value;
    }

    Object.defineProperty(window.Settings, key, {
      get: getter,
      set: setter
    });

    if(!(key in localStorage)) window.Settings[key] = defaultValue;
  }
};

if('user.token' in localStorage) {
  localStorage['userToken'] = localStorage['user.token'];
  delete localStorage['user.token'];
}

if('music.enabled' in localStorage) {
  localStorage['musicEnabled'] = localStorage['music.enabled'];
  delete localStorage['music.enabled'];
}

if('backgrounds.index' in localStorage) {
  localStorage['backgroundImageId'] = localStorage['backgrounds.index'];
  delete localStorage['backgrounds.index'];
}
