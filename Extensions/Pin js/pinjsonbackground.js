var results = {};
  
chrome.extension.onConnect.addListener(function(port) 
  {
 
  if(port.name == "newtabport")
      {
      port.postMessage({type:"results", pinres:results});   
      }
  else
  {
  port.onMessage.addListener(function(msg){
  if(msg.hasOwnProperty("type"))
      {
      if(msg.type == "New Tab")
          {
          results = msg.results;
          chrome.tabs.create({url:"panel/codetab.html"});    
          }
      }
    });
        
  chrome.webNavigation.onBeforeNavigate.addListener(function(details)
    {
    chrome.storage.local.get('pinJSPRNA', function(result){

    if(result.pinJSPRNA == true)
         {
        port.postMessage(details);
         }
    });
  });
  }
});
