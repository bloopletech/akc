"use strict";

window.Music = (function() {
  Settings.define("musicEnabled", "boolean", true);
  Settings.define("musicLastStart", "float", 0);

  var player;
  var playerInited = false;

  function getEnabled() {
    return Settings.musicEnabled;
  }

  function setEnabled(enabled) {
    if(!enabled) pause();
    Settings.musicEnabled = enabled;
    if(enabled && !playerInited) initPlayer();
  }

  function setLastStart(time) {
    Settings.musicLastStart = time;
  }

  function play() {
    if(getEnabled()) player.play();
  }

  function pause() {
    if(getEnabled()) {
      player.pause();
      if(!player.ended) setLastStart(player.currentTime);
    }
  }

  function initPlayer() {
    player = new Audio("music/Audiobinger_-_City_Lights.mp3");
    player.loop = true;
    player.addEventListener("ended", function() {
      setLastStart(null);
    });
    player.currentTime = Settings.musicLastStart;

    playerInited = true;
  }

  if(getEnabled()) initPlayer();

  return {
    getEnabled: getEnabled,
    setEnabled: setEnabled,
    play: play,
    pause: pause
  };
})();
