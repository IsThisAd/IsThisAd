var flag = false;

//Getting the url of the blogs of naver, then scraps the body of the url and changes the block color of the web page
function setColor() {
    var urlRegex = /(https?:\/\/blog[^ "]*)/
    document.querySelectorAll("li").forEach(item => {
        var url = item.innerHTML.match(urlRegex)
        url = item.innerHTML.match(urlRegex) ? item.innerHTML.match(urlRegex)[1] : ''
        if (url.length > 0 && !url.includes("MyBlog")) {
            setUrlColor(url, item)
        }
    })
}

//chages the block color of the web page 
//Green:ccffcc , Red : ffcccc
function changeBlockColor(item,ret) {
    if (ret)
        item.style.cssText = "background-color: #ccffcc";
    else
        item.style.cssText = "background-color: #ffcccc"
}

// A Temporary function, which will change to a function that applies NLP Model to the text
function printConsole(url){
    console.log(url)
    flag = !flag
    return flag
}

// scraps the url's body, apllies the model and changes block color 
function setUrlColor(url, item) {
    var strs = url.split('/')
    var newURL = "https://blog.naver.com/PostView.nhn?blogId=" + strs[3] + "&logNo=" + strs[4]
    const request = new XMLHttpRequest()
    request.open('GET', newURL, true)
    request.onload = function () {
        var parser = new DOMParser()
        var doc = parser.parseFromString(request.responseText, "text/html")
        var elem = doc.getElementById("post-view"+strs[4])
        var newText = elem.innerHTML.replace(/<[^>]*>?/g, '').replace(/\s/g, "")
        .replace("URL복사이웃추가본문기타기능지도로보기전체지도지도닫기공유하기신고하기","")
        .replace("URL복사이웃추가본문기타기능공유하기신고하기")
        .replace(/(19|20)\d{2}\.([1-9]|1[012])\.([1-9]|[12][0-9]|3[0-1])\.([0-9]|1[0-9]|2[0-3]):([0-5][0-9])*/,"")
        
        changeBlockColor(item,printConsole(newText));
    }
    request.send()
}

setColor()
