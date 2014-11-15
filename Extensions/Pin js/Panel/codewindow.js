(function() {

// This function is converted to a string and becomes the preprocessor
function preprocessor(source, url, listenerName) {
  url = url ? url : '(eval)';
  url += listenerName ? '_' + listenerName : '';
  var prefix = 'window.__preprocessed = window.__preprocessed || [];\n';
  prefix += 'window.__theCodeHolder = window.__theCodeHolder || {}'
  prefix += 'window.__theCodeHolder.__interceptedCode = window.__theCodeHolder.__interceptedCode || {}';
  prefix += 'window.__theCodeHolder.__preprocessedCode = window.__theCodeHolder.__preprocessedCode || {}'
  prefix += 'window.__theCodeHolder.__preprocessed.push(\'' + url +'\');\n';

  var postfix = '\n//# sourceURL=' + url + '.js\n';
  prefix += 'if(window.__theCodeHolder.__interceptedCode[url] != undefined){\n\
                var i = 1;\n\
                while(window.__theCodeHolder.__interceptedCode[url+"("+i+")"] != undefined){i += 1;}\n\
                window.__theCodeHolder.__interceptedCode[url+"("+i+")"] = source;\n\
                window.__theCodeHolder.__preprocessedCode[url+"("+i+")"] = source;\n\
               }else{\n\
               window.__theCodeHolder.__interceptedCode[url] = source;\n\
               window.__theCodeHolder.__preprocessedCode[url] = source; \n\
               }'
  return prefix + source + postfix;
}

function extractPreprocessedFiles(onExtracted) {
  var expr = 'window.__theCodeHolder';
  function onEval(res, isException) {
    if (isException)
      throw new Error('Eval failed for ' + expr, isException.value);
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
}

window.addEventListener('load', listen);

function createRow(url) {
  var li = document.createElement('li');
  li.textContent = url;
  return li;
}

function updateUI(codeHolder) {
  var optionSelector = document.getElementById('codeselect');
  while(optionSelecctor.options.length != 0){optionSelector.options.remove(0);}
  __interceptedCode = codeHolder.__interceptedCode;
  __preprocessedCode = codeHolder.__preprocessedCode;
  for(var key in codeHolder.__interceptedCode)
      {
      var option = document.createElement("option");
      option.text = key;
      optionSelector.add(option);
      }
  optionSelector.addEventListener('onchange', updateCodeAreas);
}

function updateCodeAreas(){
    var optionSelector = document.getElementById('codeselect');
    var index = optionSelector.options.selecteIndex;
    if(index != -1)
        {
        var key = optionSelector.options[index].text;
        document.getElementById('originalcodearea').innerHTML = __interceptedCode[key];
        document.getElementById('instcodearea').innerHTML = __preprocessedCode[key];
        }
}

})();