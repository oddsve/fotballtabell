const https = require('https');
var cheerio = require('cheerio');

var sesongliste = [];
var data ;


var  traverseFotballDOM = function(dom) {
    var $ = cheerio.load(dom);

    $('.season-select option').filter(function(){
        var data = $(this);
        var navn = data.text();
        var id = data.attr('value');
        if (navn && id > 0){
            sesongliste.push({'navn' : navn, 'id':id });
        }
    })
}

exports.hentAlle = function( cb) {
    data = {};
    sesongliste = [];


    var options = {
        hostname: 'www.fotball.no',
        path: '/turneringer/?s=91&d=',
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
            data = sesongliste;
            cb(null,data)
        });
    }

    https.request(options, callback).end();
}
