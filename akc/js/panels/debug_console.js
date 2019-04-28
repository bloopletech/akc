"use strict";

window.Panels.DebugConsole = function() {
  function mount() {
    var output = [];
    var entries = window.DebugConsole.entries();
    for(var i = 0; i < entries.length; i++) output.push(e(entries[i]));
    return output.join("<br>");
  }

  function unmount() {
  }

  return {
    mount: mount,
    unmount: unmount
  };
};
