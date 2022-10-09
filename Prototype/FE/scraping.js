
function setUrlColor() {
    var urlRegex = /(https?:\/\/blog[^ "]*)/
    var flag = false;  
    document.querySelectorAll("li").forEach(item => {
        var url = item.innerHTML.match(urlRegex)
        url = item.innerHTML.match(urlRegex) ? item.innerHTML.match(urlRegex)[1] : ''
        if(url.length > 0){
         scrapUrl(url,item,flag);
         flag = !flag;
        }
      })
  }
  function scrapUrl(url, item,flag){
    if(flag)
        item.style.cssText = "background-color: #ccffcc";
    else
        item.style.cssText = "background-color: #ffcccc"
  }
  
  setUrlColor();