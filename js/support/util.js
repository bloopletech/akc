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

window.formatNumber = function(num) {
  var x = num + '';
  var rgx = /(\d+)(\d{3})/;
  while(rgx.test(x)) x = x.replace(rgx, '$1' + ',' + '$2');
  return x;
};

function dom() {
  window.$ = document.querySelector.bind(document);
}

document.addEventListener("DOMContentLoaded", dom);