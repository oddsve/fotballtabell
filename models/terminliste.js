var http = require('https');
var cheerio = require('cheerio');
const util = require('util');

var lagsliste ;

var hentlag = function(lag){
  var ret = false;
  for (var i = 0; i< lagsliste.length; i++){
    if (lagsliste[i].navn==lag){
      ret = lagsliste[i];
    }
  }
  return ret;
}

var kalkulerOgLeggTilPoeng = function(lag, scoretMal, sluppetInnMal){
    var aklag = hentlag(lag);
    if (!aklag){
      lagsliste.push({'navn':lag, 'vunnet':0, 'uavgjort':0, 'tapt':0, 'poeng':0.0,'pm':0.0,'mm':0.0,'kamper':0.0});
      aklag = hentlag(lag);
    }
    var poeng ;
    if (scoretMal == sluppetInnMal) {
      aklag.uavgjort ++;
      poeng=1;
    } else if (scoretMal*1.0 > sluppetInnMal*1.0) {
      poeng = 3;
      aklag.vunnet ++;
    } else {
      poeng = 0;
      aklag.tapt ++;
    }

    aklag.poeng += poeng*1.0;
    aklag.pm += scoretMal*1.0;
    aklag.mm += sluppetInnMal*1.0;
    aklag.kamper ++;
    //console.log(util.inspect(lagsliste, false, null))
}

var  traverseFotballDOM = function(dom) {
  var $ = cheerio.load(dom);

  $('tr').filter(function(){
    json = {};
    var data = $(this);
    var hjemmelag = data.children('.table--mobile__home').text();
    var bortelag = data.children('.table--mobile__away').text();
    var resultat = data.children('.table--mobile__result').text();


    var myRegexp = /(\d*) - (\d*)/g;
    var match = myRegexp.exec(resultat);
    if (match) {
      var hjemmemal = match[1];
      var bortemal = match[2];

      //console.log(hjemmelag, bortelag, resultat);
      kalkulerOgLeggTilPoeng(hjemmelag,hjemmemal,bortemal);
      kalkulerOgLeggTilPoeng(bortelag,bortemal,hjemmemal);


    }

  })
}


exports.get = function(id, cb) {
  lagsliste = [];
  var options = {
    host: 'www.fotball.no',
    path: '/fotballdata/turnering/terminliste/?fiksId=' + id
  };

  callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      traverseFotballDOM(str);
      lagsliste.sort(function(a,b){
        //poeng
        if(a.poeng < b.poeng){
          return 1;
        }
        if(a.poeng > b.poeng){
          return -1;
        }

        //målforskjell
        if(a.pm-a.mm < b.pm-b.mm){
          return 1;
        }
        if(a.pm-a.mm > b.pm-b.mm){
          return -1;
        }

        //mest plussmål
        if(a.pm < b.pm){
          return 1;
        }
        if(a.pm > b.pm){
          return -1;
        }
      })

      cb(null,lagsliste)
    });
  }

  http.request(options, callback).end();
}
