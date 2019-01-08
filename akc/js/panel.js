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
    constrainPanelHeight();
  }

  function hideUi() {
    $("body").classList.remove("panel-open");
  }

  function constrainPanelHeight() {
    var computed = document.defaultView.getComputedStyle($("#panel-backdrop"));
    var innerHeight = parseInt(computed.height) - parseInt(computed.paddingTop) - parseInt(computed.paddingBottom);
    $("#panel-content").style.maxHeight = innerHeight + "px";
  }

  document.addEventListener("DOMContentLoaded", function() {
    window.addEventListener("resize", constrainPanelHeight);

    $("body").addEventListener("click", function(e) {
      if(e.target.closest("#panel-back")) back();
      else if(e.target.matches("#panel-backdrop") || e.target.closest("#panel-close")) back();
    });
  });

  return {
    forward: forward,
    back: back
  };
})();

window.Panels = {};