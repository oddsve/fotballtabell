var express = require('express')
  , router = express.Router()
  , Terminliste = require('../models/krets')


router.get('/:id', function(req, res) {
  console.log("start");
  Terminliste.get(req.params.id, function (err, data) {
    res.render('krets', {data: data})
  })
})

module.exports = router
