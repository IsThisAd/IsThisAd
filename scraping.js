var glob_arr = [];
const urlRegex = /(https?:\/\/blog[^ "]*)/

//Getting the url of the blogs of naver from Chorme Tab
function scrapData() {
    glob_arr = []
    
    //TODO : forEach가 아니라 map을 사용해서 response 받는 시점으로 배열을 쌓는게 아니라
    // request 보내는 시점으로 배열을 쌓을 수 있을지?
    // 밑의 false를 true로 만들어주면 훨씬 빠르게 가능할듯

    document.querySelectorAll("li").forEach(item => {
        var url = item.innerHTML.match(urlRegex) ? item.innerHTML.match(urlRegex)[1] : ''
        if (url.length > 0 && !url.includes("MyBlog")) {
            scrapUrl(url);
        }
    })
}

// scraps the url's body, apllies the model and changes block color 
function scrapUrl(blog_url) {
    const strs = blog_url.split('/')
    const newURL = "https://blog.naver.com/PostView.nhn?blogId=" + strs[3] + "&logNo=" + strs[4]
    const request = new XMLHttpRequest()
    
    request.open('GET', newURL, false)
    request.onload = function () {
        var parser = new DOMParser()
        var doc = parser.parseFromString(request.responseText, "text/html")
        var img_elem = doc.querySelectorAll(".se-image-resource, .se-inline-image-resource, .se-sticker-image")
        var url_arr = [];

        for(var i =  0; i < img_elem.length ; i++){
            if(img_elem[i].getAttribute("data-lazy-src"))
                url_arr.push(img_elem[i].getAttribute("data-lazy-src"))
            else
                url_arr.push(img_elem[i].src)
        }
        
        if (!findAdImageURLs(url_arr)) {
            glob_arr.push(url_arr);
        }
        else {
            console.log("Gotcha")
            glob_arr.push(config.detected)
        }

        // if you need text of blog, may use this var
        //var elem = doc.getElementById("post-view"+strs[4])
        // var newText = elem.innerHTML.replace(/<[^>]*>?/g, '').replace(/\s/g, "")
        // .replace("URL복사이웃추가본문기타기능지도로보기전체지도지도닫기공유하기신고하기","")
        // .replace("URL복사이웃추가본문기타기능공유하기신고하기")
        // .replace(/(19|20)\d{2}\.([1-9]|1[012])\.([1-9]|[12][0-9]|3[0-1])\.([0-9]|1[0-9]|2[0-3]):([0-5][0-9])*/,"")
    }
    request.send()
}

function findAdImageURLs(url_arr) {
    for (url of url_arr) {
        for (keyword of config.ad_urls) {
            if (url.includes(keyword)) { return true }
        }
    }
    return false
}

scrapData();
glob_arr;