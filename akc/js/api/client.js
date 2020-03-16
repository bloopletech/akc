"use strict";

window.Client = (function() {
  var endpoint = null;
  if(location.host == "akc.link" || location.host == "www.akc.link") endpoint = "https://api.akc.link/";
  else if(location.host == "akc.dokku.bloople.net") endpoint = "https://akc-api.dokku.bloople.net";
  else endpoint = "http://localhost:3000/";

  function serialize(params) {
    return "?" + Object.keys(params).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');
  }

  function request(options) {
    var http = new XMLHttpRequest();
    var requestType = options.type || "GET";
    var url = endpoint + options.path;

    var data = options.data || {};
    if(options.token != null) data.access_token = options.token;

    if(requestType == "GET") url += serialize(data);

    http.open(requestType, url);

    http.onreadystatechange = function() {
      if(http.readyState === 4 && http.status === 200) {
        var success = options.success;
        if(success) success(JSON.parse(http.responseText));
      }
      else if(http.readyState === 4 && http.status === 422) {
        var failure = options.failure;
        if(failure) failure(JSON.parse(http.responseText));
      }
    };

    http.setRequestHeader("Accept", "application/json");
    http.setRequestHeader("Content-Type", "text/plain");

    if(requestType != "GET" && data != {}) http.send(JSON.stringify(data));
    else http.send();
  }

  return {
    request: request
  };
})();