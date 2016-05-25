var request = require('request'),
  fs = require('fs'),
  cheerio = require('cheerio'),
  http = require('http'),
  url= 'https://spark.ru/startup/yagla';

var express = require( 'express' );
var mongoose = require('mongoose');
var Shemas = require('./shema.js');
var templating = require('consolidate');
var app = express();
var news;


app.engine('hbs', templating.handlebars);
app.set('view engine', 'hbs');
app.set('views', __dirname + ''); 
app.use(express.static('public'));



app.get('/', function (req, res) {
  Shemas.showNews(function (art) {
    res.render('handle', {
      titleSite: 'Новости проекта YAGLA на spark',
      news: art,
    
    });
  });
  
});

app.listen(3000, function () {
    console.log('Сервер запущен на порту 3000! http://localhost:3000/');
  });



var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    var r = request(uri).pipe(fs.createWriteStream(filename));
    r.on('close', callback);
  });
};


function buildCache()
{
  console.log('\n---Добавление записей в mongoDB ---\n');
  request(url, function(err, res, body) 
  {
    if (!err && res.statusCode == 200) 
    {
      var $ = cheerio.load(body);

      $('div[class="article item clear"]').each(function(i,element,callback) {
        var name = $('.title', this).text();
        var url = 'https://spark.ru' + $('.link', this).attr('href');
        var news = $('div[class="text mobile_pointer"]', this).text();
        var imgUrl = 'https://spark.ru' + $('div[class="post_image pointer p_rel"] > img', this).attr('src');
        var imgName = $('div[class="post_image pointer p_rel"] > img', this).attr('alt').replace(':','').replace('%','').replace('"','');
//console.log(url);
        getFullArticle(url, name, news);
        var objectSave = {
          title: name,
          url: url,
         news: news,
          img: imgName,


           
        }
        download(imgUrl, 'public/' + imgName + '.jpg', function(){
          console.log('Картинка успешно сохранена');
        })
        Shemas.save(objectSave);
      })

    }

    else {
      console.log(err); 
      console.log(res.statusCode);

    }
  });


                  
}

function getFullArticle(urlArticle, name, news,callback) {
    request(urlArticle, function(err, res, body,callback) {
       if (!err && res.statusCode == 200) {

           var $ = cheerio.load(body);
          var full=$('div[itemprop="description"]').text() + $('div[class="b_body clear"] > p').text() ;
        Shemas.save(full);
            
        }
         console.log(full);
    });

}

buildCache();
setInterval(function() {buildCache();}, 6000000);

module.exports.buildCache = buildCache;