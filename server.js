// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var Klubber         = require('./models/klubber');
var Kretser         = require('./models/kretser');
var Turneringer     = require('./models/turneringer');
var Sesonger        = require('./models/sesonger');
var Tabeller        = require('./models/tabeller');

app.use(express.static('client/build'));

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 5000;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here
// on routes that end in /kretser
// ----------------------------------------------------

router.route('/sesonger')
    .get(function(req, res) {
        Sesonger.hentAlle(function(err, sesonger) {
            if (err)
                res.send(err);

            res.json(sesonger);
        });
    });

router.route('/kretser')
    .get(function(req, res) {
        Kretser.hentAlle(91, function(err, kretser) {
            if (err)
                res.send(err);

            res.json(kretser);
        });
    });

router.route('/kretser/:kretsId/klubber')
    .get(function(req, res) {
        Klubber.hentAlle(91, req.params.kretsId, function(err, klubber) {
            if (err)
                res.send(err);

            res.json(klubber);
        });
    });

//brukes for å hente inneværende sesong
router.route('/kretser/:kretsId/klubber/:klubbId/turneringer')
    .get(function(req, res) {
        //jukser todo hent siste sesong
        Turneringer.hentAlle(91, req.params.kretsId, req.params.klubbId, function(err, sesonger) {
            if (err)
                res.send(err);

            res.json(sesonger);
        });
    });


router.route('/kretser/:kretsId/klubber/:klubbId/sesonger/:sesongId/turneringer')
    .get(function(req, res) {
        Turneringer.hentAlle(req.params.sesongId, req.params.kretsId, req.params.klubbId, function(err, sesonger) {
            if (err)
                res.send(err);

            res.json(sesonger);
        });
    });


router.route('/turneringer/:turneringId')
    .get(function(req, res) {
        Tabeller.hentTurnering(req.params.turneringId, function(err, turnering) {
            if (err)
                res.send(err);

            res.json(turnering);
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
