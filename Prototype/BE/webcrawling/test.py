import re, requests
from main import text_scraping, delete_iframe
from bs4 import BeautifulSoup
# Test Class for blog link test
class BlogTests():

    post_link = False
    blog_text = False
    img_src = []

    def set_blog_values(self, post_link):
        self.post_link = post_link
        blog_p = re.compile("blog.naver.com")
        blog_m = blog_p.search(post_link)
        if blog_m:
            self.img_src, self.blog_text = text_scraping(delete_iframe(post_link))

    def start_test(self, flag):
        self.test_blog_has_img()
        self.test_blog_has_text()
        self.get_html(flag)

    # 블로그 이미지 여부 확인
    def test_blog_has_img(self):
        if not self.img_src:
            print("이미지 없음")

    # 블로그 본문이 비었는지 확인
    def test_blog_has_text(self):
        if not self.blog_text:
            print("블로그 본문 없음")

    # 블로그가 스티커 이미지가 있는지 확인
    # def test_blog_has_sticker(self):
    #

    # 블로그의 스마트 에디터 버전을 판별

    def get_html(self, print_or_not):
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36"}
        res = requests.get(self.post_link, headers=headers)
        res.raise_for_status()  # 문제시 프로그램 종료
        soup = BeautifulSoup(res.text, "lxml")
        if print_or_not:
            print(soup)

if __name__ == "__main__":

    post_link = input()
    test = BlogTests()
    test.set_blog_values(post_link)
    test.start_test(False)
