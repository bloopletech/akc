var Video = (function() {
  var CLOUDX_VIDEO_IDS = [
    'dLovK29c9r4',
    'NQWJ3_FOa4M',
    'xh8NiBc4lrY',
    '_4E1ZuxNTA8',
    'HzT7rruSRw4',
    '0Mr7dJ4ENtE',
    'gZh-ip1rUso',
    'QRitJzrtx9w',
    'eApo3hGc0g4',
    'b_0xZSiA6JE',
    '34oPpO102S8',
    'yUfBMrvm6Ng',
    'Ri9jm3WDixE',
    'Td2BeAWFUuI',
    '21nkd9dCM68',
    'bIuKnRPcKNQ',
    'f83ltVJ6B7o',
    'EElY79VSpqQ',
    'Tx9WyKtLzio',
    '5ajFrJKFrk4',
    'BzSA9fhfan0',
    '36csrfm6qrk',
    'CMniyEHkJZ4',
    'tg0nW0THqfs',
    'h2caHn3FlgA',
    'H_-ikay9HoU',
    'zQ9BipSloL0',
    'SgP5YnZ5Q-A',
    'KUXefzZ07eo',
    'D4JnrExUdIg',
    'BYHiI4nS2O4',
    'et4dVSw7aCE',
    'lQrfI1W1Ftg',
    'u4x9YyRnFDE',
    'UiSb0FXtG5A',
    '3JX8TivvGyc',
    'h7to4He-6OY',
    'x_Q80rVuCe8',
    'u6AMrcGdf0c',
    'OyVP2cposYE',
    'eMNa9aKqh6I',
    'lbNHQC4Aluw',
    's4N89-FB6NE',
    'glV-cPor06k',
    'D3vy-eO_QKM',
    'P4w-3zVUDmY',
    'dtkhdBGp8os',
    'GXmGFlAldAk',
    'gunmwbrkWOw',
    'zp4TUSOzLIg',
    'LBnRvK8jadg',
    'bRgVq-rGMXs'
  ];

  var XEFOX_VIDEO_IDS = [
    '1cL8VPI4oOI',
    'kfFfxJrKhLw',
    'RPMTZfNSXYQ',
    '7rQEH43GG8c',
    '2d9P58JilsY',
    'R2rNQP_d-1I',
    'Fjqs-qmkNug',
    'CvdupAL4vuc',
    'Ma8x33jWwuE',
    'wLWTw40U8X8',
    'bcnj9btzcm8',
    '8ph9OM6rbQ0',
    'pD2LJTBm9jc',
    'mDjIWbFveKw',
    'xv0DYXmhGL0',
    'tonLMgjEuMQ',
    'n2MjMylvNvI',
    'yzIEtSbuHj8',
    '-ZO1sL1-s6E',
    'gf1VGEDROyY',
    'Wi4mxG1RoOI',
    'Hv67s7gWrXs',
    'F0u90QZLjl8',
    '2ZKerYWBuRI',
    'emYAAYT6KHc',
    'ZrLef3xMY3o',
    'HwkrAOAScnk',
    'RPnaMoftS70',
    'qbB_owuShfA',
    'IR0y65bcbZY',
    'vZJyt3q9fXY',
    'PV8vK2VdmpU',
    'Cd9hekSTYAE',
    '_0kAYDIyIyo',
    'vu7YJGiiZX4'
  ];

  var VIDEO_IDS = CLOUDX_VIDEO_IDS.concat(XEFOX_VIDEO_IDS);

  var youtube;
  var youtubeInited = false;
  var youtubeReady = false;
  var videoId = VIDEO_IDS[Math.floor(Math.random() * VIDEO_IDS.length)];

  function lastStartKey() {
    return "player." + videoId + ".lastStart";
  }

  function getLastStart() {
    var lastStart = localStorage[lastStartKey()];
    return lastStart ? parseFloat(lastStart) : 0;
  }

  function setLastStart(time) {
    if(time == null) delete localStorage[lastStartKey()];
    else localStorage[lastStartKey()] = time;
  }

  function play() {
    if(youtubeReady) youtube.playVideo();
  }

  function pause() {
    if(youtubeReady) {
      youtube.pauseVideo();
      if(youtube.getPlayerState() != YT.PlayerState.ENDED) setLastStart(youtube.getCurrentTime());
    }
  }

  function initYoutube() {
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    youtubeInited = true;
  }

  window.onYouTubeIframeAPIReady = function() {
    var pausedAfterLoad = false;
    youtube = new YT.Player('video', {
      videoId: videoId,
      playerVars: {
        autoplay: 0,
        disablekb: 1,
        controls: 0,
        fs: 0
      },
      events: {
        onReady: function() {
          youtubeReady = true;
          youtube.seekTo(getLastStart(), true);
        },
        onStateChange: function(event) {
          if(event.data == YT.PlayerState.PLAYING && !pausedAfterLoad) {
            pausedAfterLoad = true;
            youtube.pauseVideo();
          }
          if(event.data == YT.PlayerState.ENDED) setLastStart(null);
        }
      }
    });
  }

  return {
    init: initYoutube,
    play: play,
    pause: pause
  };
})();
