import re
from urllib.parse import quote
import requests
from bs4 import BeautifulSoup
import pandas as pd

from Prototype.BE.webcrawling.package.thread import ThreadWithReturnValue


# Chormedriver.exe 절대 경로
chromePath = "C:\\Users\\USER\\Desktop\\chromedriver.exe"
# query (검색어)
query = "맛집"
FIRST_INDEX = 0

# naver 블로그가 아닌 경우, false return
def check_blog_or_not(url):
    res = requests.get(url)
    res.raise_for_status() # 문제시 프로그램 종료
    soup = BeautifulSoup(res.text, "lxml")
    if soup.find('script', attrs={"text/javascript"}, string="blog"): #, attrs={"content":"blog"})
        return True
    else:
        print("블로그가 아닙니다")
        return False

# iframe 제거 후 blog.naver.com 붙이기
def delete_iframe(url):
    res = requests.get(url)
    res.raise_for_status()  # 문제시 프로그램 종료
    soup = BeautifulSoup(res.text, "lxml")

    src_url = "https://blog.naver.com/" + soup.iframe["src"]

    return src_url

# 네이버블로그 본문 스크래핑
# 블로그 url을 인자로 받아, ([사진 링크들], 본문) return
# 감지하지 못하거나, 잘못된 형식의 url을 받은 경우 ([], None) 을 return
def text_scraping(url):
    headers = {"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36"}
    res = requests.get(url, headers=headers)
    res.raise_for_status() # 문제시 프로그램 종료
    soup = BeautifulSoup(res.text, "lxml")

    # 마무리 되면 or 연산으로 변경하면 더 빠를듯
    images = soup.findAll("img", attrs={"class": "se-image-resource"})
    stickers = soup.findAll("img", attrs={"class": "se-sticker-image"})
    inline_images = soup.findAll("img", attrs={"class": "se-inline-image-resource"})

    image_link = []

    if images:
        for image in images:
            if 'data-lazy-src' in image.attrs:
                image_link.append(image['data-lazy-src'])
            else:
                image_link.append(image['src'].replace("?type=w80_blur", ""))

    if stickers:
        for image in stickers:
            image_link.append(image['src'])

    if inline_images:
        for image in inline_images:
            image_link.append(image['src'])


    if soup.find("div", attrs={"class":"se-main-container"}):
        text = soup.find("div", attrs={"class":"se-main-container"}).get_text()
        text = text.replace("\n", " ") #공백 제거
        text = text.replace("\r", " ")
        return image_link, text


    soup = soup.find("div", attrs={"id":"postViewArea"})
    if soup:
        images = soup.findAll("img")
        if images:
            for image in images:
                image_link.append(image['src'])
        text = soup.get_text()
        text = text.replace("\n", " ")
        text = text.replace("\r", " ")
        return image_link, text
    else:
        return image_link, None

# 네이버 viewMoreContents Request을 반환
def get_more_contents_url(index):
    # 한번에 30개씩 return
    if index == 0:
        return "https://search.naver.com/search.naver?&query=" + quote(query) + "&nso=&where=blog&sm=tab_opt"

    query_number = 31 + index*30

    return "https://s.search.naver.com/p/blog/search.naver?where=blog&sm=tab_pge&api_type=1&query=" + quote(query) + "&rev=44&start=" + str(query_number) + "&dup_remove=1&post_blogurl=&post_blogurl_without=&nso=&nlu_query=%7B%22r_category%22%3A%2229%22%7D&dkey=0&source_query=&nx_search_query=" + quote(query) + "&spq=0&_callback=viewMoreContents"

# 네이버 viewMoreContents Request를 발송하여 받아
# 해당하는 데이터 셋을 반환
def get_data_from_url(url):

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36"}
    res = requests.get(url, headers=headers)
    res.raise_for_status()  # 문제시 프로그램 종료
    soup = BeautifulSoup(res.text, "lxml")

    posts = soup.find_all("li", attrs={"class":'\\"bx\\"'})

    result_list = []
    # api_txt_lines total_tit
    for post in posts:
        data = []
        post_link = post.find("a", attrs={"class":'\\"api_txt_lines'})['href']
        post_link = post_link.replace('\\"', "")
        data.append(post_link)

        blog_p = re.compile("blog.naver.com")
        blog_m = blog_p.search(post_link)
        if blog_m:
            images_src, blog_text = text_scraping(delete_iframe(post_link))
            if blog_text is not None:
                # blog_text = blog_text.replace("?type=w80_blur", "")  # 공백 제거
                data.append(images_src)
                data.append(blog_text)
            result_list.append(data)

    return result_list

# 첫번째 검색의 경우, 그 후의 검색들과는 경우가 달라 따로 함수처리
def get_data_from_first_query(url):

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36"}
    res = requests.get(url, headers=headers)
    res.raise_for_status()  # 문제시 프로그램 종료

    soup = BeautifulSoup(res.text, "lxml")
    posts = soup.find_all("li", attrs={"class": "bx"})
    tmpPosts = []

    for post in posts:
        if len(post.attrs['class']) == 1:
            tmpPosts.append(post)

    result_list = []

    for post in tmpPosts:
        data = []
        post_link = post.find("a", attrs={"class": "api_txt_lines total_tit"})['href']
        data.append(post_link)

        blog_p = re.compile("blog.naver.com")
        blog_m = blog_p.search(post_link)
        if blog_m:
            images_src, blog_text = text_scraping(delete_iframe(post_link))
            if blog_text is not None:
                data.append(images_src)
                data.append(blog_text)
            result_list.append(data)
    return result_list

#


# [데이터 셋에 필요한 것] <3000개>
# [링크, 본문, 모든 사진 링크]

if __name__ == "__main__":

    # query에 따른 url 생성
    url = get_more_contents_url(FIRST_INDEX)

    data_batch = get_data_from_first_query(url)
    i = 1
    for k in range(1, 20):
        threads = []
        data = []
        for j in range(i, i + 10):
            url = get_more_contents_url(j)
            t = ThreadWithReturnValue(target=get_data_from_url, args=(url,))
            t.start()
            threads.append(t)
        i += 10
        for thread in threads:
            data = data + thread.join()
        df = pd.DataFrame(data, columns=['post_link', 'image_src', 'blog_text'])
        file_name = "data" + str(int(i/10))
        df.to_csv('C:\\Users\\USER\\Desktop\\data\\' + file_name + '.csv', encoding='utf-8')
        print(k, ": done")