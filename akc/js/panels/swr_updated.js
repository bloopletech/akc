"use strict";

window.Panels.SwrUpdated = function() {
  function mount() {
    return `
      The game has been updated, please <a href='javascript:window.location.reload()'>reload the game</a>
      to play on the latest version.
    `;
  }

  function unmount() {
  }

  return {
    mount: mount,
    unmount: unmount
  };
};
