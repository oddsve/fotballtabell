var http = require('https');
var cheerio = require('cheerio');
const util = require('util');

var data ;
var lagsliste ;
var kampliste ;

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
      var lagTrimmet = lag.toLowerCase().replace(/\s/g, '');
      lagsliste.push({'navn':lag, 'lagTrimmet': lagTrimmet, 'vunnet':0, 'uavgjort':0, 'tapt':0, 'poeng':0.0,'pm':0.0,'mm':0.0,'kamper':0.0});
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

var leggTilKamp = function (hjemmelag, bortelag, hjemmemal, bortemal, dato, runde, tidspunkt) {
  var kamp = {}
  kamp.dato = dato;
  kamp.runde = runde;
  kamp.hjemmelag = hjemmelag;
  kamp.bortelag = bortelag;
  kamp.beggelagTrimmet = bortelag.toLowerCase().replace(/\s/g, '') + " " + hjemmelag.toLowerCase().replace(/\s/g, '');
  kamp.hjemmemal = hjemmemal;
  kamp.bortemal = bortemal;
  kamp.tidspunkt = tidspunkt;
  if (hjemmemal) {
      kamp.resultat = hjemmemal + " - " + bortemal;
      if( hjemmemal*1.0 > bortemal*1.0 ){
        kamp.hjemmeseier = "vinner";
      } else if (bortemal*1.0 > hjemmemal*1.0) {
        kamp.borteseier = "vinner";
      }

  } else {
    kamp.resultat = tidspunkt;
  }

  kampliste.push(kamp);
}

var  traverseFotballDOM = function(dom) {
  var $ = cheerio.load(dom);

  data.turnering = $('.pre-season-text').text();

  $('tr').filter(function(){
    var data = $(this);
    var hjemmelag = data.children('.table--mobile__home').text();
    var bortelag = data.children('.table--mobile__away').text();
    var resultat = data.children('.table--mobile__result').text();
    var dato = data.children('.table--mobile__date').text();
    var runde = data.children('.table--mobile__round').text();
    var tidspunkt = data.children('.table--mobile__time').text();

    var bortemal = null;
    var hjemmemal = null;


    var myRegexp = /(\d*) - (\d*)/g;
    var match = myRegexp.exec(resultat);
    if (match) {
      hjemmemal = match[1];
      bortemal = match[2];

      //console.log(hjemmelag, bortelag, resultat);
      kalkulerOgLeggTilPoeng(hjemmelag,hjemmemal,bortemal);
      kalkulerOgLeggTilPoeng(bortelag,bortemal,hjemmemal);


    }
    leggTilKamp(hjemmelag, bortelag, hjemmemal, bortemal, dato, runde, tidspunkt);


  })
}


exports.get = function(id, cb) {
  lagsliste = [];
  kampliste = [];
  data = {};
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
      data.lagsliste = lagsliste;
      data.kampliste = kampliste;
      cb(null,data)
    });
  }

  http.request(options, callback).end();
}
