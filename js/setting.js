"use strict";

window.Setting = (function() {
  var settingTypes = {};

  function get(key) {
    var value = localStorage[key];

    var type = settingTypes[key];
    if(type == "boolean") return value == "true";
    else if(type == "integer") return parseInt(value);
    else if(type == "float") return parseFloat(value);
    else return value;
  }

  function set(key, value) {
    if(value == null) delete localStorage[key];
    else localStorage[key] = value;
  }

  function init(key, value, type) {
    if(type != "boolean" && type != "integer" && type != "float" && type != "string") throw "Invalid setting type";

    settingTypes[key] = type;
    if(!(key in localStorage)) set(key, value);
  }

  function setting() {
    if(arguments.length == 2) set(arguments[0], arguments[1]);
    else return get(arguments[0]);
  }

  setting.init = init;

  return setting;
})();