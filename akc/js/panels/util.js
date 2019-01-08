"use strict";

window.Panels.Util = (function() {
  var dateFormatter = new Intl.DateTimeFormat('en-AU', {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric',
    hour12: true
  });

  function formatDate(date) {
    return dateFormatter.format(date).replace(",", "");
  }

  function formatTimestamp(timestamp) {
    return formatDate(Date.parse(timestamp));
  }

  function format(input) {
    var type = typeof input;
    if(input instanceof Date) return formatDate(input);
    if(type == "number") return input.toLocaleString();
    return input;
  }

  function stripWhiteSpaceHTML(html) {
    return html.replace(/(<(pre|script|style|textarea)[^]+?<\/\2)|(^|>)\s+|\s+(?=<|$)/g, "$1$3");
  }

  function escapeHTML(unsafe) {
    if(unsafe == null) return "";
    return unsafe.toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatThenEscape(input) {
    return escapeHTML(format(input));
  }

  return {
    formatDate: formatDate,
    formatTimestamp: formatTimestamp,
    format: format,
    stripWhiteSpaceHTML: stripWhiteSpaceHTML,
    escapeHTML: escapeHTML,
    formatThenEscape: formatThenEscape
  }
})();

window.e = Panels.Util.escapeHTML;
window.f = Panels.Util.format;
window.ef = Panels.Util.formatThenEscape;
window.m = Panels.Util.stripWhiteSpaceHTML;