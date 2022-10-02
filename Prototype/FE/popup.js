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
    document.querySelectorAll("li").forEach(item => {
      if(item.innerHTML.substring(0,38) == " <div class=\"total_wrap api_ani_send\">")
      {
        item.style.cssText = "background-color: beige";   
      }
    })
  }