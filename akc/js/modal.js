"use strict";

window.Modal = (function() {
  function show(content) {
    $("#modal-content").innerHTML = content;
    $("body").classList.add("modal-open");
    position();
  }

  function position() {
    var modal = $("#modal");
    modal.style.top = ((window.innerHeight - modal.offsetHeight) / 2) + "px";
  }

  function hide() {
    $("body").classList.remove("modal-open");
  }

  document.addEventListener("DOMContentLoaded", function() {
    window.addEventListener("resize", position);

    $("body").addEventListener("click", function(e) {
      if(e.target.matches("#modal-backdrop")) hide();
    });
  });

  return {
    show: show,
    hide: hide
  };
})();
