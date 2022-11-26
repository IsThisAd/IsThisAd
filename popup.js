let changeColor = document.getElementById("changeColor");

// When the button is clicked, inject scaping.js/setColor
changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files : ["scraping.js"],      
    }, (injectionResults) => {
      for (const frameResult of injectionResults){
        doOCR(frameResult.result)
          .then((results) => applyResults(results))
      }
    });
  });
