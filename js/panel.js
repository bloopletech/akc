"use strict";

window.Panel = (function() {
  function show(content) {
    $("#panel-content").innerHTML = content;
    $("body").classList.add("panel-open");
  }

  function hide() {
    $("body").classList.remove("panel-open");
    window.location.hash = "#";
  }

  document.addEventListener("DOMContentLoaded", function() {
    $("body").addEventListener("click", function(e) {
      if(e.target.matches("#panel-backdrop") || e.target.closest("#panel-close")) hide();
    });
  });

  return {
    show: show,
    hide: hide
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