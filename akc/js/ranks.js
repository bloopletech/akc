"use strict";

window.Ranks = (function() {
  var RANKS = {
    bronze: {
      minScore: 0,
      humanName: "Bronze",
      class: "bronze"
    },
    silver: {
      minScore: 50000,
      humanName: "Silver",
      class: "silver"
    },
    gold: {
      minScore: 80000,
      humanName: "Gold",
      class: "gold"
    },
    platinum: {
      minScore: 100000,
      humanName: "Platinum",
      class: "platinum"
    },
    diamond: {
      minScore: 1100000,
      humanName: "Diamond",
      class: "diamond"
    },
    vanadium: {
      minScore: 120000,
      humanName: "Vanadium",
      class: "vanadium"
    },
    strontium: {
      minScore: 130000,
      humanName: "Strontium",
      class: "strontium"
    }
  };

  function scoreRank(score) {
    var currentRank = null;
    for(var i in RANKS) {
      var rank = RANKS[i];
      if(score >= rank.minScore) currentRank = rank;
    }

    return currentRank;
  }

  return {
    scoreRank: scoreRank
  }
})();