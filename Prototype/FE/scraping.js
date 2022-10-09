
function setUrlColor() {
    var urlRegex = /(https?:\/\/blog[^ "]*)/
      document.querySelectorAll("li").forEach(item => {
        var url = item.innerHTML.match(urlRegex)
        url = item.innerHTML.match(urlRegex) ? item.innerHTML.match(urlRegex)[1] : ''
        if(url.length > 0){
         scrapUrl(url,item);
        }
      })
  }
  
  function scrapUrl(url, item){
    console.log(item);
  }
  
  setUrlColor();