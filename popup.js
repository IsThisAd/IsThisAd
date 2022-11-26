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

function findKeywords(results) {
  console.log(results)
  
  const labels = results.map((item) => (
    item.data.text.includes("제공")
  ));

  console.log(labels)

  return labels
}

// When the button is clicked, inject scaping.js/setColor
changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files : ["scraping.js"],      
    }, (injectionResults) => {
      for (const frameResult of injectionResults){
        console.log(frameResult.result)
        doOCR(frameResult.result)
          .then((results) => findKeywords(results))
          .then((labels) => chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func : setColorNew,
            args : [labels],
        }))
      }
    });
  });
