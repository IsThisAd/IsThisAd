async function applyResults(ocrResults) {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    console.log(ocrResults)

    const texts = ocrResults.map((item) => removeWhitespace(item.data.text));
    const labels = texts.map((item) => findKeywords(item))

    console.log(labels)

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func : setColorNew,
        args : [labels],
    })
}

function removeWhitespace(text) {
    return text.replace(/ /g, '')
}

function findKeywords(text) {
    if (text == config.deteceted) { return true }
    for (keyword of config.ocr_keywords) {
        if (text.includes(keyword)) { return true }
    }
    return false
}

function setColorNew(labels) {
    var index = 0
    var urlRegex = /(https?:\/\/blog[^ "]*)/
    document.querySelectorAll("li").forEach(item => {
        var url = item.innerHTML.match(urlRegex)
        url = item.innerHTML.match(urlRegex) ? item.innerHTML.match(urlRegex)[1] : ''
        if (url.length > 0 && !url.includes("MyBlog")) {
            if (!labels[index])
                item.style.cssText = "background-color: #ccffcc";
            else
                item.style.cssText = "background-color: #ffcccc"
            index++
        }
    })
}