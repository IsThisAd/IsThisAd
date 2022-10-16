import sys
import os
import pandas as pd
from preprocess import preprocess_sentence
from labeling import ocr_labeling, text_labeling
from parsing import post_link_parse, image_url_parse
from tqdm import tqdm
from time import strftime, time, localtime


tqdm.pandas()

data_dir = sys.argv[1]
result = pd.DataFrame()
len_sum = 0

files = os.listdir(data_dir)
for file in files:
    print("Start preprocessing " + file + "!")
    
    df = pd.read_csv(data_dir + "/" + file, encoding='utf-8')
    
    len_sum += len(df)
    
    # post_link 파싱
    df[['user_id', 'post_id']] = df.apply(lambda x: post_link_parse(x['post_link']), 
                                          axis=1, result_type='expand')
    # 본문 전처리
    df['blog_text'] = df.apply(lambda x: preprocess_sentence(x['blog_text']), axis=1)
    
    # 본문 키워드 검사
    df['text_label'] = df.apply(lambda x : text_labeling(x['blog_text']), axis=1)
    
    # 이미지 URL OCR 후 키워드 검사
    df[['ocr_label', 'ocr_src']] = df.progress_apply(lambda x : ocr_labeling(
                image_url_parse(x['image_src']), 5), axis=1, result_type='expand')
    
    # 데이터 타입 변환 후 라벨링
    df = df.astype({'ocr_label':'int', 'text_label':'int'})
    df['label'] = df['ocr_label'] | df['text_label']
    
    # column 이름 정렬
    df = df[['post_id', 'label', 'text_label', 'ocr_label', 'ocr_src', 'user_id', 
             'post_link', 'blog_text', 'image_src']]

    result = pd.concat([result, df])

result.drop_duplicates(['user_id', 'post_id'], inplace=True)

print("\nSum of Length: %d"%(len_sum))
print("Result Length: %d"%(len(result)))
print("Dropped Items: %d"%(len_sum - len(result)))

current_time = strftime('%Y-%m-%d-%I-%M', localtime(time()))
result.to_csv("traindata/"+current_time+".csv", index=False)

print("\nNew file name: " + "traindata/"+current_time+".csv")
