//Getting the url of the blogs of naver, then scraps the body of the url and changes the block color of the web page
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
//chages the block color of the web page
function changeBlockColor(url, item, flag) {
    if (flag)
        item.style.cssText = "background-color: #ccffcc";
    else
        item.style.cssText = "background-color: #ffcccc"
}
// scraps the url's body 
function scrapUrl(url, item) {
    if (url.includes("MyBlog")) {
        return
    }

    newURL = makeNewURL(url)

    const request = new XMLHttpRequest()
    request.open('GET', newURL, true)
    request.onload = function () {
        var parser = new DOMParser()
        var doc = parser.parseFromString(request.responseText, "text/html")
        strs = url.split('/')
        var elem = doc.getElementById("post-view"+strs[4])
        var pattern = /(19|20)\d{2}\.([1-9]|1[012])\.([1-9]|[12][0-9]|3[0-1])\.([0-9]|1[0-9]|2[0-3]):([0-5][0-9])*/
        const newText = elem.innerHTML.replace(/<[^>]*>?/g, '').replace(/\s/g, "")
        .replace("URL복사이웃추가본문기타기능지도로보기전체지도지도닫기공유하기신고하기","")
        .replace("URL복사이웃추가본문기타기능공유하기신고하기")
        .replace(pattern,"");

        console.log(newText)
    }
    request.send()
}
// make's a url that avails scraping
function makeNewURL(url) {
    strs = url.split('/')
    var newURL = "https://blog.naver.com/PostView.nhn?blogId=" + strs[3] + "&logNo=" + strs[4]

    return newURL
}
setUrlColor();
