"use strict";

window.e = function(unsafe) {
  if(unsafe == null) return "";
  return unsafe.toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function dom() {
  window.$ = document.querySelector.bind(document);
}

document.addEventListener("DOMContentLoaded", dom);