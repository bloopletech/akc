"use strict";

window.Panel = (function() {
  var stack = [];

  function current() {
    return stack[stack.length - 1];
  }

  function forward(panel) {
    stack.push(panel);
    open();
  }

  function open() {
    if(current()) showUi(current().mount());
  }

  function back() {
    if(current()) stack.pop().unmount();
    if(current()) open();
    else hideUi();
  }

  function close() {
    var panel = null;
    while(panel = stack.pop()) panel.unmount();
    hideUi();
  }

  function showUi(content) {
    $("#panel-content").innerHTML = content;
    $("body").classList.add("panel-open");
  }

  function hideUi() {
    $("body").classList.remove("panel-open");
  }

  document.addEventListener("DOMContentLoaded", function() {
    $("body").addEventListener("click", function(e) {
      if(e.target.closest("#panel-back")) back();
      else if(e.target.matches("#panel-backdrop") || e.target.closest("#panel-close")) close();
    });
  });

  return {
    forward: forward,
    back: back
  };
})();

window.e = function(unsafe) {
  if(unsafe == null) return "";
  return unsafe.toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

window.Panels = {};