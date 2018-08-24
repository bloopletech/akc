"use strict";

window.Modal = (function() {
  function show(content) {
    $("#modal-content").innerHTML = content;
    $("body").classList.add("modal-open");
  }

  function hide() {
    $("body").classList.remove("modal-open");
  }

  document.addEventListener("DOMContentLoaded", function() {
    $("body").addEventListener("click", function(e) {
      if(e.target.matches("#modal-backdrop") || e.target.matches("#modal-close")) hide();
    });
  });

  return {
    show: show,
    hide: hide
  };
})();
