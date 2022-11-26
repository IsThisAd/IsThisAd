let changeColor = document.getElementById("changeColor");

// When the button is clicked, inject scaping.js/setColor

function isLoading(option){
  if(option){
    changeColor.innerHTML = "<i class=\"fa fa-spinner fa-spin\">";
    document.getElementById("message").innerHTML = "작업 처리중입니다...<br> 10초에서 20초 정도 소요될 수 있습니다."
  }
  else{
    document.getElementById("message").innerHTML = "작업 처리 완료"
    changeColor.innerHTML = " "
  }
}

changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    isLoading(true);
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files : ["config.js", "scraping.js"],      
    }, (injectionResults) => {
      for (const frameResult of injectionResults){
        console.log(frameResult.result)
        doOCR(frameResult.result)
          .then((results) => applyResults(results)
            .then(isLoading(false))
          )
      }
    });
  });
