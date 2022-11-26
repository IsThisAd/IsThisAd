let changeColor = document.getElementById("changeColor");

var flag = false;
function setColorNew(result) {
    var urlRegex = /(https?:\/\/blog[^ "]*)/
    document.querySelectorAll("li").forEach(item => {
        var url = item.innerHTML.match(urlRegex)
        url = item.innerHTML.match(urlRegex) ? item.innerHTML.match(urlRegex)[1] : ''
        if (url.length > 0 && !url.includes("MyBlog")) {
            flag = !flag;
            if (flag)
                item.style.cssText = "background-color: #ccffcc";
            else
                item.style.cssText = "background-color: #ffcccc"
        }
    })
}

// When the button is clicked, inject scaping.js/setColor
changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    var result;

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files : ["scraping.js"],      
    }, (injectionResults) => {
      for (const frameResult of injectionResults){
        console.log(frameResult.result)
        result = doOCR(frameResult.result)
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func : setColorNew,
          args : [result],
        });
      }
    });
  });
