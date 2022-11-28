//Getting the url of the blogs of naver from Chorme Tab
async function scrapData() {
    var result = []
    var blog_items = []
    const urlRegex = /(https?:\/\/blog[^ "]*)/
    const scrapBlogImageURL = function(blog_url) {
            return new Promise((resolve, reject) => {
            const strs = blog_url.split('/')
            const newURL = "https://blog.naver.com/PostView.nhn?blogId=" + strs[3] + "&logNo=" + strs[4]
            const request = new XMLHttpRequest()
            var items = [];
    
            request.open('GET', newURL, true)
            request.onload = function () {
                var parser = new DOMParser()
                var doc = parser.parseFromString(request.responseText, "text/html")
    
                // if you need text of blog, may use this var
                var text_elem = doc.getElementById("post-view"+strs[4])
                var blog_text = text_elem.innerHTML.replace(/<[^>]*>?/g, '').replace(/\s/g, "")
                // .replace("URL복사이웃추가본문기타기능지도로보기전체지도지도닫기공유하기신고하기","")
                // .replace("URL복사이웃추가본문기타기능공유하기신고하기")
                // .replace(/(19|20)\d{2}\.([1-9]|1[012])\.([1-9]|[12][0-9]|3[0-1])\.([0-9]|1[0-9]|2[0-3]):([0-5][0-9])*/,"")

                items.push(blog_text)

                var img_elem = doc.querySelectorAll(".se-image-resource, .se-inline-image-resource, .se-sticker-image")
                for(var i =  0; i < img_elem.length ; i++){
                    if(img_elem[i].getAttribute("data-lazy-src"))
                        items.push(img_elem[i].getAttribute("data-lazy-src"))
                    else
                        items.push(img_elem[i].src)
                }

                // items의 첫번째 원소는 블로그의 텍스트, 이후 원소는 블로그 내의 이미지 URL
                resolve(items)
            }
            request.send()
        })
    };

    document.querySelectorAll("li").forEach(item => {
        var url = item.innerHTML.match(urlRegex) ? item.innerHTML.match(urlRegex)[1] : ''
        if (url.length > 0 && !url.includes("MyBlog")) {
            blog_items.push(url)
        }
    })

    await Promise.all(blog_items.map(scrapBlogImageURL))
        .then((value) => result = value)

    console.log(result)

    return result
}

