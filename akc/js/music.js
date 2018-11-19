"use strict";

window.Music = (function() {
  var ENABLED_KEY = "music.enabled";
  var LAST_START_KEY = "music.lastStart";
  Setting.init(ENABLED_KEY, true, "boolean");
  Setting.init(LAST_START_KEY, 0, "float");

  var player;
  var playerInited = false;

  function getEnabled() {
    return Setting(ENABLED_KEY);
  }

  function setEnabled(enabled) {
    if(!enabled) pause();
    Setting(ENABLED_KEY, enabled);
    if(enabled && !playerInited) initPlayer();
  }

  function setLastStart(time) {
    Setting(LAST_START_KEY, time);
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
    player.currentTime = Setting(LAST_START_KEY);

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
