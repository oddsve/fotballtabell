var http = require('https');
var cheerio = require('cheerio');
const util = require('util');

var klubbliste = [];
var data ;


var  traverseFotballDOM = function(dom) {
  var $ = cheerio.load(dom);

  $('#c option').filter(function(){
    var data = $(this);
    var navn = data.text();
    var id = data.attr('value');

    klubbliste.push({'navn' : navn, 'href': '/klubb/' + id });
  })
}

exports.get = function(id, cb) {
  data = {};
  klubbliste = [];
  var options = {
    host: 'www.fotball.no',
    path: '/turneringer/?s=88&d=' + id
  };


  callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      traverseFotballDOM(str);
      data.klubbliste = klubbliste;
      cb(null,data)
    });
  }

  http.request(options, callback).end();
}
