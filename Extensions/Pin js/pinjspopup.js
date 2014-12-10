
function init() {
  
  var prnaCheckBox = document.getElementById("prna")
  chrome.storage.local.get('pinJSPRNA', function(result){
  if(result.pinJSPRNA == true)
      {
      console.log("prna is true");
      prnaCheckBox.checked = true;   
      }
  else
      {
      console.log("prna is false");
      prnaCheckBox.checked = false;           
      }
});

prnaCheckBox.addEventListener("change", function(){
    chrome.storage.local.get('pinJSPRNA', function(result){console.log(result);});
    
    if(prnaCheckBox.checked)
        {
        chrome.storage.local.set({'pinJSPRNA':true}, function(){console.log("set (true) complete");});  
        }
    else
        {
        chrome.storage.local.set({'pinJSPRNA':false}, function(){console.log("set (false) complete");});       
        }
        
    chrome.storage.local.get('pinJSPRNA', function(result){console.log(result);});    
    });
}


document.addEventListener('DOMContentLoaded', init);