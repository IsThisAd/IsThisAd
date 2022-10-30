# 전처리 이후의 데이터 분석

```python
import pandas as pd
```


```python
df = pd.read_csv("data_v1.csv")
```


```python
df.columns
```




    Index(['label', 'text_label', 'ocr_label', 'ocr_src', 'post_id', 'user_id',
           'post_link', 'blog_text', 'image_src'],
          dtype='object')



총 데이터 수


```python
len(df)
```




    3922



광고로 판별된 데이터 수


```python
df.label.value_counts()
```




    0    2822
    1    1100
    Name: label, dtype: int64




```python
df.label.value_counts(normalize=True) * 100
```




    0    71.953085
    1    28.046915
    Name: label, dtype: float64



텍스트로 식별된 데이터 수


```python
df.text_label.value_counts()
```




    0    3804
    1     118
    Name: text_label, dtype: int64



이미지로 식별된 데이터 수 (뒤에서 7번째 이미지까지만 검사)


```python
df.ocr_label.value_counts()
```




    0    2935
    1     696
    2     113
    3      53
    4      42
    5      39
    6      29
    7      15
    Name: ocr_label, dtype: int64




```python
df.ocr_label.value_counts(normalize=True) * 100
```




    0    74.834268
    1    17.746048
    2     2.881183
    3     1.351351
    4     1.070882
    5     0.994391
    6     0.739419
    7     0.382458
    Name: ocr_label, dtype: float64



텍스트와 이미지 모두로 식별된 데이터 수


```python
len(df[(df.text_label > 0) & (df.ocr_label > 0)])
```




    5


