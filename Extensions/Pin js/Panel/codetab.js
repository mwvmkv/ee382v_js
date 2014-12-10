(function() {

// This function is converted to a string and becomes the preprocessor
window.addEventListener('load', listen);

function listen() {

  var backButton = document.getElementById('backButton');
  backButton.addEventListener('click', back);
  
  var forwardButton = document.getElementById('forwardButton');
  forwardButton.addEventListener('click', forward);
  
  port = chrome.extension.connect({name:"newtabport"});
  
  instrumentationTop = {};
  instrumetationHeirarchy = [];
  
  port.onMessage.addListener(function(msg){
      if(msg.type == "results")
        {
        instrumentationTop = msg.pinres;
        updateInstResults();
        }
    });
}

function createRow(url) {
  var li = document.createElement('li');
  li.textContent = url;
  return li;
}


function back (){
    alert("back function");
    alert(instrumentationTop);
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

})();