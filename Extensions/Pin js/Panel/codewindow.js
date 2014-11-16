(function() {

// This function is converted to a string and becomes the preprocessor

function extractPreprocessedFiles(onExtracted) {
  var expr = '[window.__preprocessed, window.__interceptedCode, window.__preprocessedCode]';
  function onEval(res, isException) {
    if (isException){
      alert('exception');
      throw new Error('Eval failed for ' + expr, isException.value);
    }
    alert("calling on extracted");
    onExtracted(res);
  }
  alert("calling eval");
  chrome.devtools.inspectedWindow.eval(expr, onEval);
}

function demoPreprocessor() {
    alert("Test Load Fired");
    extractPreprocessedFiles(updateUI);
}

window.addEventListener('load', listen);

function listen() {
  var loadButton = document.getElementById('loadButton');
  loadButton.addEventListener('click', demoPreprocessor);
}

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