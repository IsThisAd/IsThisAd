from PIL import Image
import pytesseract
from urllib import request
from io import BytesIO

def ocr_labeling(urls, n):
    '''
    urls : 이미지 URL 리스트
    n : 살펴볼 이미지 URL의 수
    return : 키워드 포함 여부, 포함되어 있던 URL
    '''
    pytesseract.pytesseract.tesseract_cmd = R'C:\Program Files\Tesseract-OCR\tesseract'
    ocr_keywords = ["제공", "업체", "협찬", "지급", "원고료"]
    
    for url in urls[-n:]:
        try:
            res = request.urlopen(url).read()
            img = Image.open(BytesIO(res))
            text = pytesseract.image_to_string(img, lang='kor').replace('\n', '').replace(' ', '')
        except:
            print("Can't read image URL: "+url)
            continue
        
        if any(keyword in text for keyword in ocr_keywords):
            return int(1), url.split('/')[2]
    
    return int(0), None

def text_labeling(blog_text):
    '''
    blog_text : 포스트 본문
    return : 키워드 포함 여부
    '''
    text_keywords = ['제공받아', '협찬받아', '지급받아', '제공 받아', '협찬 받아', '지급 받아']
    return int(any(keyword in blog_text for keyword in text_keywords))