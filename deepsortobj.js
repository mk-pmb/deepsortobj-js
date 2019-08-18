/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
/*globals define:true */
'use strict';

(function (factory) {
  if (('function' === typeof define) && define.amd) { return define(factory); }
  if (('object' === typeof module) && module && module.exports) {
    module.exports = factory();
  }
}(function () {
  var EX;

  function sortArrayInplace(keyList) { return keyList.sort(); }
  function numCmp(a, b) { return a - b; }

  function limitedLastIndexOf(needle, haystack, maxIdx) {
    while ((maxIdx >= 0) && (haystack[maxIdx] !== needle)) { maxIdx -= 1; }
    return maxIdx;
  }

  function throwCircRefErr(ref, info) {
    var err = 'Encountered a circular reference at ' +
      (info ? info.srcPath.join('.') : '<unknown path>');
    err = new Error(err);
    err.circRef = (info || ref);
    throw err;
  }

  function expectFunc(f) {
    var t = typeof f;
    if (t === 'function') { return f; }
    throw new TypeError('Expected a function. not ' + t);
  }

  function ifUndef(val, dflt) { return (val === undefined ? dflt : val); }

  function parseOpt_sortKeys(val) {
    switch (val) {
    case undefined:
    case true:
      return EX.numsLast;
    case 'fast':
      return sortArrayInplace;
    }
    return expectFunc(val);
  }

  function parseOpt_circ(val) {
    switch (val) {
    case undefined:
    case 'copy':      // deprecated
    case 'congruent':
      return false;
    case 'ign':
      // nothing special here; instead, the ignorance is achieved by
      // having an empty sortedParents array.
      return false;
    case 'err':
      return throwCircRefErr;
    }
    return expectFunc(val);
  }


  EX = function sortObj(obj, how) {
    how = (how || false);
    if (typeof how === 'function') { how = { sort: how }; }
    var srcPath = [], onCircRef = how.circular, diveUnlessCircular, circIdx,
      origParents = (onCircRef === 'ign' ? null : []),
      sortedParents = (origParents && []),
      isAry = expectFunc(ifUndef(how.isArray, Array.isArray)),
      dictKeys = expectFunc(ifUndef(how.dictKeys, EX.dictKeys)),
      keyPrefix = (how.keyPrefix || ''),
      keySuffix = (how.keySuffix || ''),
      sortKeys = parseOpt_sortKeys(how.sortKeys);
    onCircRef = parseOpt_circ(onCircRef);

    function dive(origDepth, origVal) {
      if ((origVal && typeof origVal) !== 'object') { return origVal; }
      var maxParentIdx, keys, sorted, subDepth;
      if (!isAry(origVal)) {
        keys = dictKeys(origVal);
        if (!keys) { return origVal; }
      }
      sorted = (keys ? {} : []);
      if (keys && sortKeys) { keys = sortKeys(keys); }
      if (origParents) {
        origParents[origDepth] = origVal;
        sortedParents[origDepth] = sorted;
        maxParentIdx = origDepth - 1;
      }
      subDepth = origDepth + 1;
      (keys || origVal).forEach(function (subVal, subKey) {
        if (keys) {
          subKey = subVal;
          subVal = origVal[subKey];
        }
        srcPath[origDepth] = subKey;
        subVal = diveUnlessCircular(subDepth, subVal, maxParentIdx);
        if (keys) { subKey = keyPrefix + subKey + keySuffix; }
        sorted[subKey] = subVal;
      });
      return sorted;
    }

    diveUnlessCircular = (origParents ? function (depth, val, maxParentIdx) {
      circIdx = limitedLastIndexOf(val, origParents, maxParentIdx);
      if (circIdx < 0) { return dive(depth, val); }
      if (!onCircRef) { return sortedParents[circIdx]; }
      var shortPath = srcPath.slice(0, depth);
      return onCircRef(val, { srcPath: shortPath, ref: val,
        parents: origParents, });
    } : dive);

    return ((obj && typeof obj) === 'object' ? dive(0, obj) : obj);
  };


  // BEGIN define integer key
  EX.intRgx = /^0$|^-?[1-9][0-9]*$/;
  // ENDOF define integer key
  EX.numsLast = (function () {
    return function numsLast(keys) {
      var texts = [], nums = [];
      keys.forEach(function (k) {
        if (EX.intRgx.test(k)) { return nums.push(k); }
        texts.push(k);
      });
      return texts.sort().concat(nums.sort(numCmp));
    };
  }());


  EX.dictKeys = function dictKeys(x) {
    return (((x && typeof x) === 'object') && (!(Array.isArray(x)
      || Buffer.isBuffer(x)
      )) && Object.keys(x));
  };



















  return EX;
}));
