let changeColor = document.getElementById("changeColor");

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: setUrlColor,
    });
  });

  function setUrlColor() {
    var urlRegex = /(https?:\/\/[^ ]*)/
    document.querySelectorAll("li").forEach(item => {
      //console.log(item.innerHTML);
      //console.log("\n");
      var url = item.innerHTML.match(urlRegex)
      url = item.innerHTML.match(urlRegex) ? item.innerHTML.match(urlRegex)[1] : ''
      if(url.length > 0)
        console.log(url);
    })
    
  }
