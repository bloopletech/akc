"use strict";

window.Epsilon = function() {
  const EPSILON = 0.1;
  
  function eq(a, b) {
    return Math.abs(a - b) < EPSILON;
  }
  
  function lt(a, b) {
    return b - a > EPSILON;
  }
  
  function lte(a, b) {
    return eq(a, b) || lt(a, b);
  }
  
  function gt(a, b) {
    return a - b > EPSILON;
  }
  
  function gte(a, b) {
    return eq(a, b) || gt(a, b);
  }

  return {
    eq: eq,
    lt: lt,
    lte: lte,
    gt: gt,
    gte: gte
  };
};

window.E = new Epsilon();