"use strict";

function modal() {
  window.Modal = (function() {
    var $ = document.querySelector.bind(document);

    function show(content) {
      $("#modal-content").innerHTML = content;
      document.querySelector("body").classList.add("modal-open");
      position();
    }

    function position() {
      var modal = $("#modal");
      modal.style.top = ((window.innerHeight - modal.offsetHeight) / 2) + "px";
    }

    function hide() {
      document.querySelector("body").classList.remove("modal-open");
    }

    window.addEventListener("resize", position);

    document.body.addEventListener("click", function(e) {
      if(e.target.matches("#modal-backdrop")) hide();
    });

    return {
      show: show,
      position: position,
      hide: hide
    }
  })();
}

document.addEventListener("DOMContentLoaded", modal);
