let changeColor = document.getElementById("changeColor");

changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    isLoading(true);
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func : scrapData,      
    }, (injectionResults) => {
      for (const frameResult of injectionResults){
        let start = new Date();
        let end

        console.log(frameResult.result)
        
        detected_image_urls = frameResult.result.map(findAdImageURLs)
        
        console.log(detected_image_urls)
        
        doOCR(detected_image_urls)
          .then((results) => applyResults(results)
            .then(isLoading(false))
              .then(end = new Date())
                .then(console.log(end-start))
          )
      }
    });
  });


function findAdImageURLs(url_arr) {
  for (url of url_arr) {
      for (keyword of config.ad_urls) {
          if (url.includes(keyword)) { return config.detected }
      }
  }
  return url_arr
}


// When the button is clicked, inject srcaping.js/setColor

function isLoading(option){
  if(option){
    changeColor.innerHTML = "<i class=\"fa fa-spinner fa-spin\">";
    document.getElementById("message").innerHTML = "작업 처리중...<br> 소요시간 : 5초 ~ 10초<br> 팝업을 종료하지 마세요!"
  }
  else{
    document.getElementById("message").innerHTML = "작업 처리 완료"
    changeColor.innerHTML = " "
  }
}