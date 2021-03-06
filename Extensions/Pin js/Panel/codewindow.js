(function() {

// This function is converted to a string and becomes the preprocessor

function extractInstrumentationResults() {
  var expr = 'PIN';
  function onEval(res, isException) {
    if (isException){
      throw new Error('Eval failed for ' + expr, isException.value);
    }
    updateUI(res);
  }
  chrome.devtools.inspectedWindow.eval(expr, onEval);
}

window.addEventListener('load', listen);

function myFunc(x) {
  alert("Called me!!");
}

function listen() {
  var loadButton = document.getElementById('loadButton');
  loadButton.addEventListener('click', extractInstrumentationResults);
  
  var tabButton = document.getElementById('newTabButton');
  tabButton.addEventListener('click', createNewTab);
  
  var backButton = document.getElementById('backButton');
  backButton.addEventListener('click', back);
  
  var forwardButton = document.getElementById('forwardButton');
  forwardButton.addEventListener('click', forward);

  port = chrome.extension.connect({name:"navigationport"});
  
  instrumentationTop = {};
  
  port.onMessage.addListener(function(msg){
      if(msg.tabId == chrome.devtools.inspectedWindow.tabId)
        {
        extractInstrumentationResults();
        }
    });
 // alert(JSON.stringify(chrome));
  //chrome.webNavigation.onBeforeNavigate.addListener(myFunc);
}

function createRow(url) {
  var li = document.createElement('li');
  li.textContent = url;
  return li;
}
function updateUI(results) {
  //alert(JSON.stringify(results));
  instrumetationHeirarchy = [];
  instrumentationResults = results;
  instrumentationTop = results;
  instrumentationResultsCurrentKeys = Object.keys(results);
  var optionSelector = document.getElementById('instSelect');
  var resultsDisplay = document.getElementById('resultsarea');
  var resultsAreaText = "";
  while(optionSelector.options.length != 0){optionSelector.options.remove(0);}

for(var i = 0; i < instrumentationResultsCurrentKeys.length; i++)
    {
        if(typeof results[instrumentationResultsCurrentKeys[i]] === 'object')
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
  document.getElementById('heirarchyLabel').innerHTML = "Top";
  resultsDisplay.innerHTML = resultsAreaText;
  optionSelector.size = optionSelector.options.length;
}

function back (){
    if(instrumetationHeirarchy.length > 0)
        {
        instrumetationHeirarchy.pop();
        }
    updateInstResults();
}

function forward (select){
    var optionSelector = document.getElementById('instSelect');
    var index = optionSelector.selectedIndex;
    if(index != -1)
        {
        instrumetationHeirarchy.push(instrumentationResultsCurrentKeys[index])
        }
        updateInstResults();
}
        
function updateInstResults(){
    var hlabel = document.getElementById('heirarchyLabel');
    var newLabel = "Top";
    var res = instrumentationTop;
    for(var i = 0; i < instrumetationHeirarchy.length; i++)
        {
        newLabel = newLabel+">"+instrumetationHeirarchy[i];
        res = res[instrumetationHeirarchy[i]];
        }
   hlabel.innerHTML = newLabel;
   
  instrumentationResultsCurrentKeys = Object.keys(res);
  var optionSelector = document.getElementById('instSelect');
  var resultsDisplay = document.getElementById('resultsarea');
  var resultsAreaText = "";
  while(optionSelector.options.length != 0){optionSelector.options.remove(0);}
  for(var i = 0; i < instrumentationResultsCurrentKeys.length; i++)
    {
        if(typeof res[instrumentationResultsCurrentKeys[i]] === 'object')
            {
            var option = document.createElement("option");
            option.text = String(instrumentationResultsCurrentKeys[i]);
            optionSelector.add(option);     
            }
        else
            {
            resultsAreaText = resultsAreaText +'\n'+String(instrumentationResultsCurrentKeys[i])+": "+
                String(res[instrumentationResultsCurrentKeys[i]]);
            }    
    }
  resultsDisplay.innerHTML = resultsAreaText;
  optionSelector.size = optionSelector.options.length;
}

function createNewTab(){
   port.postMessage({"type":"New Tab", "results":instrumentationTop});
}

})();