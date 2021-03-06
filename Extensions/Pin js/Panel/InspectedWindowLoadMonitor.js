// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/** @fileoverview The chrome.devtools API does not support notifications from
 *  within a Web page nor does it report on events occuring in the page. For now
 *  we poll the page to determine a reasonable time to report the scripts.
 */

(function() {
  /*
   * @param {function} Called  after the 'load' event on the inspected window
   * @return {function} A function to be injected into the inspected window.
   */
  function LoadMonitor(onLoadedCallback) {

    function checkForLoad() {
      var expr = 'window.__inspectedWindowLoaded';
      function onEval(isLoaded, isException) {
        if (isException)
          throw new Error('Eval failed for ' + expr, isException.value);
        if (isLoaded)
          onLoadedCallback();
        else
          pollForLoad();
      }
      chrome.devtools.inspectedWindow.eval(expr, onEval);
    }

    function pollForLoad() {
      setTimeout(checkForLoad, 200);
    }

    pollForLoad();
  }

  LoadMonitor.prototype = {
    // This function should be converted to a string and run in the Web page
    injectedScript: function() {
      // Initialize a secret data structure.
      window.__Pin_JS_InstrumentationResults = {};
      window.__Pin_JS_InstrumentationResults['instr1'] = {'key1':1, 'key2':2};
      window.__Pin_JS_InstrumentationResults['instr2'] = {};
      window.__Pin_JS_InstrumentationResults['instr2']['sub1'] = {'key3':3, 'key2':4};
      window.__Pin_JS_InstrumentationResults['instr2']['sub2'] = {'key5':5, 'key6':6};
      window.__Pin_JS_InstrumentationResults['instr2']['key7'] = 7;
      window.__Pin_JS_InstrumentationResults['instr2']['key8'] = 8;
      window.__inspectedWindowLoaded = false;
      // PIN master object
      PIN = new Object();
      PIN.stats = {};
      PIN.stats.execFreq = {};

      window.addEventListener('load', function() {
        window.__inspectedWindowLoaded = true;
        console.log('loaded');
        //pin initialize code//
        PIN_Initialize();
      });
    }
  };

  window.InspectedWindow = window.InspectedWindow || {};
  InspectedWindow.LoadMonitor = LoadMonitor;
})();


