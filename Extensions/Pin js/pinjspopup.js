var exInfo;
var extensionID = "no id";
var extensionEnabled = "false";
var extensionName = "Pin.js Extension for Chrome";

function getPinjsExtension(exs){
for(var ex in exs)
    {
    console.log(exs[ex]);
    if(exs[ex].name == extensionName)
        {
        extensionID = exs[ex].id;
        return;
        }
    }
}

function init() {
  
  document.getElementById("enableButton").addEventListener('click', toggleEnableFunc);
  chrome.management.getAll(getPinjsExtension);
  
  chrome.storage.local.get('pinJSEnabled', function(result){
  extensionEnabled = result.pinJSEnabled;
  console.log("Enabled: "+extensionEnabled);
    
  if(extensionEnabled)
      {
      document.getElementById("isEnabled").innerHTML = "Atom JS is enabled";
      document.getElementById("enableButton").innerHTML = "Disable Atom JS";
      chrome.browserAction.setIcon({path:"pin_green.png"});
      }
  else
      {
      document.getElementById("isEnabled").innerHTML = "Atom JS is disabled";
      document.getElementById("enableButton").innerHTML = "Enable Atom JS";
      chrome.browserAction.setIcon({path:"pin_red.png"});   
      }
});

}

    function toggleEnableFunc()
		{	
                chrome.storage.local.get('pinJSEnabled', function(result){
                var color;
                extensionEnabled = result.pinJSEnabled;
                console.log("Enabled: "+extensionEnabled);
               
                   
		if(extensionEnabled)
			{
			color = "red";
			document.getElementById("isEnabled").innerHTML = "Atom JS is now disabled";
			chrome.storage.local.set({'pinJSEnabled': false});
                        document.getElementById("enableButton").innerHTML = "Enable Atom JS";
                        }
                else
			{
			color = "green";
			document.getElementById("isEnabled").innerHTML = "Atom JS is now enabled";			
			chrome.storage.local.set({'pinJSEnabled': true});
                        document.getElementById("enableButton").innerHTML = "Disable Atom JS";
                        }
		
                chrome.browserAction.setIcon({path:"pin_" + color + ".png"});
                 });
		}

document.addEventListener('DOMContentLoaded', init);