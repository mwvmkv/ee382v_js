(function() {

// This function is converted to a string and becomes the preprocessor

function extractInstrumentationResults() {
  var expr = 'window.__Pin_JS_InstrumentationResults';
  function onEval(res, isException) {
    if (isException){
      alert('exception');
      throw new Error('Eval failed for ' + expr, isException.value);
    }
    updateUI(res);
  }
  chrome.devtools.inspectedWindow.eval(expr, onEval);
}

window.addEventListener('load', listen);

function listen() {
  var loadButton = document.getElementById('loadButton');
  loadButton.addEventListener('click', extractInstrumentationResults);
  
  var backButton = document.getElementById('backButton');
  loadButton.addEventListener('click', back);
  
  var forwardButton = document.getElementById('forwardButton');
  loadButton.addEventListener('click', forward);
}

function createRow(url) {
  var li = document.createElement('li');
  li.textContent = url;
  return li;
}
function updateUI(results) {
  instrumetationHeirarchy = [];
  instrumentationResults = results;
  instrumentationResultsCurrentKeys = Object.keys(results);
  var optionSelector = document.getElementById('instSelect');
  var resultsDisplay = document.getElementById('resultsarea');
  var resultsAreaText = "";
  while(optionSelector.options.length != 0){optionSelector.options.remove(0);}

for(var i = 0; i < instrumentationResultsCurrentKeys.length; i++)
    {
        if(typeof results[instrumentationResultsCurrentKeys[i]] === 'object' || 
            typeof results[instrumentationResultsCurrentKeys[i]] === 'array')
            {
            var option = document.createElement("option");
            option.text = String(instrumentationResultsCurrentKeys[i]);
            optionSelector.add(option);     
            }
        else
            {
            resultsAreaText = resultsAreaText +'\n'+String(instrumentationResultsCurrentKeys[i])+": "+
                String(results[instrumentationResultsCurrentKeys[i]]);
            }    
    }
  resultsDisplay.innerHTML = resultsAreaText;
  //Object.keys(results).forEach(function(key){});
  optionSelector.addEventListener('change', updateResultsArea);
  optionSelector.size = optionSelector.options.length;
}

function back (){
    alert("back clicked");
    if(instrumetationHeirarchy.length > 0)
        {
        instrumentationHeirarchy.pop();
        }
    
}

function forward (select){
    alert("Change event fired");
    var optionSelector = document.getElementById('instSelect');
    var index = optionSelector.selectedIndex;
    if(index != -1)
        {
        instrumetationHeirarchy.push(instrumentationResultsCurrentKeys[index])
        }
}
        
function updateInstResults(){
    var hlabel = document.getElementById('heararchyLabel');
    var newLabel = "Top";
    for(var i = 0; i < instrumetationHeirarchy.length; i++)
        {
        newLabel = newLabel+">"+instrumetationHeirarchy[i];
        }
}

})();