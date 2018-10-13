"use strict";

window.Jukebox = (function() {
  var player;
  var playerInited = false;

  function enabledKey() {
    return "jukebox.enabled";
  }

  function getEnabled() {
    var enabled = localStorage[enabledKey()];
    return enabled ? enabled == "true" : true;
  }

  function setEnabled(enabled) {
    if(!enabled) pause();
    localStorage[enabledKey()] = enabled;
    if(enabled && !playerInited) initPlayer();
  }

  function play() {
    if(getEnabled()) player.play();
  }

  function pause() {
    if(getEnabled()) {
      player.pause();
    }
  }

  function initPlayer() {
    if(document.documentElement.clientWidth >= 600) {
      player = window.Video;
    }
    else {
      player = window.Music;
    }
    player.init();

    playerInited = true;
  }

  document.addEventListener("DOMContentLoaded", function() {
    if(getEnabled()) initPlayer();
  });

  return {
    getEnabled: getEnabled,
    setEnabled: setEnabled,
    play: play,
    pause: pause
  };
})();