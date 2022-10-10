
function setUrlColor() {
    var urlRegex = /(https?:\/\/blog[^ "]*)/
    var flag = false;
    document.querySelectorAll("li").forEach(item => {
        var url = item.innerHTML.match(urlRegex)
        url = item.innerHTML.match(urlRegex) ? item.innerHTML.match(urlRegex)[1] : ''
        if (url.length > 0) {
            if (!url.includes("MyBlog")) {
                scrapUrl(url, item);
                changeBlockColor(url, item, flag);
            }
            flag = !flag;
        }
    })
}

function changeBlockColor(url, item, flag) {
    if (flag)
        item.style.cssText = "background-color: #ccffcc";
    else
        item.style.cssText = "background-color: #ffcccc"
}

function scrapUrl(url, item) {
    if (url.includes("MyBlog")) {
        return
    }

    newURL = makeNewURL(url)

    const request = new XMLHttpRequest()
    request.open('GET', newURL, true)
    request.onload = function () {
        //console.log(request.responseText.match(/\<div id="post-view.*\<\/div>/));
        var parser = new DOMParser()
        var doc = parser.parseFromString(request.responseText, "text/html")
        console.log(doc)
    }
    request.send()
}

function makeNewURL(url) {
    strs = url.split('/')
    var newURL = "https://blog.naver.com/PostView.nhn?blogId=" + strs[3] + "&logNo=" + strs[4]

    return newURL
}
setUrlColor();
