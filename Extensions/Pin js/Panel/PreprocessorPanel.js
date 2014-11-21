// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
(function() {
    
    
    
// This function is converted to a string and becomes the preprocessor
function preprocessor(source, url, listenerName) {
    
  url = url ? url : '(eval)';
  url += listenerName ? '_' + listenerName : '';
  
  var prefix = 'window.__preprocessed = window.__preprocessed || [];\n';
  prefix += 'window.__interceptedCode = window.__interceptedCode || [];\n';
  prefix += 'window.__preprocessedCode = window.__preprocessedCode || [];\n';
  prefix += 'window.__preprocessed.push(\'' + url +'\');\n';
  prefix += 'window.__interceptedCode.push(' + JSON.stringify(source) +');\n';
  prefix += 'window.__preprocessedCode.push(' + JSON.stringify(source) +');\n';
  
  var postfix = '\n//# sourceURL=' + url + '.js\n';
 

  
  //var jsParser = new PIN_JS_AST_Parser(source);
  //jsParser.walkTree();
  //var preProcessedSource = jsParser.walkTreeAndGenerate();
  //return prefix + preProcessedSource + postfix;
  return prefix + source + postfix;
}

function extractPreprocessedFiles(onExtracted) {
  var expr = '[window.__preprocessed, window.__interceptedCode, window.__preprocessedCode]';
  function onEval(res, isException) {
    if (isException){
      alert('exception');
      throw new Error('Eval failed for ' + expr, isException.value);
    }
    //alert(JSON.stringify(res));
    onExtracted(res);
  }
  chrome.devtools.inspectedWindow.eval(expr, onEval);
}

function reloadWithPreprocessor(injectedScript) {
  var options = {
    ignoreCache: true,
    userAgent: undefined,
    injectedScript: '(' + injectedScript  + ')()',
    preprocessingScript: '(' + preprocessor + ')'
  };
  chrome.devtools.inspectedWindow.reload(options);
}

function demoPreprocessor() {
  function onLoaded() {
    extractPreprocessedFiles(updateUI);
  }
  var loadMonitor = new InspectedWindow.LoadMonitor(onLoaded);
  reloadWithPreprocessor(loadMonitor.injectedScript);
}

function listen() {
  var reloadButton = document.querySelector('.reload-button');
  reloadButton.addEventListener('click', demoPreprocessor);
  var scrollLeft = document.getElementById('originalcodearea');
  var scrollRight = document.getElementById('instcodearea');

  var jsParser = new PIN_JS_AST_Parser('var x = 1;');
  
  scrollLeft.addEventListener("scroll", leftScrollbarSync);
  scrollRight.addEventListener("scroll", rightScrollbarSync);
  
}

function leftScrollbarSync(){
  var scrollLeft = document.getElementById('originalcodearea');
  var scrollRight = document.getElementById('instcodearea');

 if(document.getElementById('checklinked').checked)
    {
    scrollRight.scrollTop = scrollLeft.scrollTop;
    }
}

function rightScrollbarSync(){
  var scrollLeft = document.getElementById('originalcodearea');
  var scrollRight = document.getElementById('instcodearea');
 if(document.getElementById('checklinked').checked)
    {
    scrollLeft.scrollTop = scrollRight.scrollTop;
    }
}

window.addEventListener('load', listen);

function createRow(url) {
  var li = document.createElement('li');
  li.textContent = url;
  return li;
}

function updateUI(codeHolder) {

  funcNames = [];
  originalCode = [];
  processedCode = [];

  funcNames = funcNames.concat(codeHolder[0]);
  originalCode = originalCode.concat(codeHolder[1]);
  processedCode = processedCode.concat(codeHolder[2]);

  var optionSelector = document.getElementById('codeselect');
  while(optionSelector.options.length != 0){optionSelector.options.remove(0);}

  funcNames.forEach(function(name) {
      var option = document.createElement("option");
        option.text = name;
        optionSelector.add(option);
  });
  optionSelector.addEventListener('change', updateCodeAreas);
}

function updateCodeAreas(select){
    var optionSelector = document.getElementById('codeselect');
    var index = optionSelector.selectedIndex;
    if(index != -1)
        {
        document.getElementById('originalcodearea').innerHTML = originalCode[index];
        document.getElementById('instcodearea').innerHTML = processedCode[index];
        }

}

})();

