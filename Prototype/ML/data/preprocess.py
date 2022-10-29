import re

def preprocess_sentence(sentence):
    try:
        sentence = remove_hashtag(sentence)
        sentence = remove_phonenumber(sentence)
        #sentence = remove_address(sentence)
        sentence = remove_special(sentence)
        sentence = simplify_sentence(sentence)
    except:
        sentence = ""
        
    return sentence

def remove_phonenumber(sentence):
    sentence = re.sub("\d{2,3}\D?\d{3,4}\D?\d{4}", "", sentence)
    return sentence

def remove_address(sentence):
    sentence = re.sub("(\s.*[도])?\s.*[시]\s(\s(.*[동]))?\s(.*[길])?(.*[동])?\s\d+\D?\d+", "", sentence)
    return sentence

def remove_hashtag(sentence):
    sentence = re.sub("#([0-9a-zA-Z가-힣]*)", "", sentence)
    return sentence

def remove_special(sentence):
    sentence = sentence.strip()
    sentence = re.sub("[^0-9가-힣?.!,¿]+", " ", sentence)
    sentence = sentence.strip()
    return sentence

def simplify_sentence(sentence):
    sentence = re.sub("([^가-힣\s])\\1{1,}", "\\1", sentence)
    sentence = ' '.join(sentence.split())
    return sentence