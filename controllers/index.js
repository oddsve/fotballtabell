var express = require('express')
  , router = express.Router();
  //, Tabell = require('../models/comment')

router.use('/tabell', require('./tabell'))
router.use('/klubb', require('./klubb'))
router.use('/krets', require('./krets'))


router.get('/', function(req, res) {
  res.render('index', {})
})

module.exports = router;
