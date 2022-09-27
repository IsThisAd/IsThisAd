import requests
from bs4 import BeautifulSoup
from urllib.parse import quote
import re

# naver 블로그가 아닌 경우, false return
def check_blog(url):
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
def text_scraping(url):
    headers = {"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36"}
    res = requests.get(url, headers=headers)
    res.raise_for_status() # 문제시 프로그램 종료
    soup = BeautifulSoup(res.text, "lxml")
    images = soup.select('div img')

    for i in images:
        print(i['src'])

    if soup.find("div", attrs={"class":"se-main-container"}):
        text = soup.find("div", attrs={"class":"se-main-container"}).get_text()
        text = text.replace("\n","") #공백 제거
        return text

    elif soup.find("div", attrs={"id":"postViewArea"}):
        text = soup.find("div", attrs={"id":"postViewArea"}).get_text()
        text = text.replace("\n","")
        return text
    else:
        return "네이버 블로그는 맞지만, 확인불가"

post_link = "https://blog.naver.com/dbwls0315/222852690296"

blog_p = re.compile("blog.naver.com")
blog_m = blog_p.search(post_link)

if blog_m:
    blog_text = text_scraping(delete_iframe(post_link))
    print("본문:", blog_text)

print("-" * 50)