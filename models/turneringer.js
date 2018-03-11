var http = require('https');
var cheerio = require('cheerio');

var turneringsliste = [];
var data ;


var  traverseFotballDOM = function(dom) {
  var $ = cheerio.load(dom);

  $('li.grid__item').filter(function(){
    var data = $(this);
    var navn = data.text();
    var href = data.children('a').attr('href');

    console.log(navn);
    console.log(href);
    var myRegexp = /(\d*)$/g;
    var match = myRegexp.exec(href);
    var id = match[1];
    console.log(id);
    turneringsliste.push({'navn' : navn, 'id': id });
  })
}

exports.hentAlle = function(sesongId, kretsId, klubbId, cb) {
  data = {};
  turneringsliste = [];
  var options = {
    host: 'www.fotball.no',
    path: '/turneringer/?s='+sesongId+'&d='+ kretsId+'&c=' + klubbId
  };


  callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      traverseFotballDOM(str);
      data = turneringsliste;
      cb(null,data)
    });
  }

  http.request(options, callback).end();
}
