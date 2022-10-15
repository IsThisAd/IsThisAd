import re

def post_link_parse(post_link):
    '''
    post_link  : blog URL
    return : user_id, post_id
    '''
    items = post_link.split("/")
    user_id = items[3]
    post_id = items[4]
    return user_id, post_id

def image_url_parse(image_src):
    '''
    image_src : list formed string
    return : list of URL
    '''
    return re.sub("\'|\[|\]|\,", "", image_src).split()