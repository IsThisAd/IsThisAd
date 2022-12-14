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
        
        // frameResult.result의 첫번째 원소는 블로그의 텍스트
        // 이후 원소는 블로그 내의 이미지 URL
        detected_image_urls = frameResult.result.map(findAdPosting)

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

function findAdPosting(items) {
  const image_urls = items.slice(1)
  
  if (findAdKeywordInText(items[0])) { return config.detected }
  if (findAdImageURLs(image_urls)) { return config.detected }

  return image_urls
}

function findAdKeywordInText(text) {
  for (keyword of config.text_keywords) {
    if (text.includes(keyword)) { return true }
  }
  return false
}

function findAdImageURLs(url_arr) {
  for (url of url_arr) {
      for (ad_url of config.ad_urls) {
          if (url.includes(ad_url)) { return true }
      }
  }
  return false
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