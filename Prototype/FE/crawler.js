var client = require('cheerio-httpcli');
//import { Client}  from './node_modules/cheerio-httpcli'
//import pkg from 'cheerio-httpcli'
//const {Client} = pkg;
var word = "서강대 맛집"
console.log(word)
client.fetch('https://www.google.com/search',
{q : word},
function(err, $,res, body){
    console.log(res.headers);
    console.log($('title').text());
    $('a').each(function(idx){
        console.log($(this).attr('href'));
    });
});
