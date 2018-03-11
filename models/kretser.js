const https = require('https');
var cheerio = require('cheerio');

var kretsliste = [];
var data ;


var  traverseFotballDOM = function(dom) {
  var $ = cheerio.load(dom);

  $('.district-select option').filter(function(){
    var data = $(this);
    var navn = data.text();
    var id = data.attr('value');
    if (navn && id > 0){
        kretsliste.push({'navn' : navn, 'id':id });
    }
  })
}

exports.hentAlle = function( sesongId, cb) {
    data = {};
    kretsliste = [];


    var options = {
        hostname: 'www.fotball.no',
        path: '/turneringer/?s=' + sesongId +'&d=',
        method: 'GET'
  };



  var callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      traverseFotballDOM(str);
      data = kretsliste;
      cb(null,data)
    });
  }

     https.request(options, callback).end();
}
