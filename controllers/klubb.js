var express = require('express')
  , router = express.Router()
  , Terminliste = require('../models/klubber')


router.get('/:id', function(req, res) {
  console.log("start");
  Terminliste.get(req.params.id, function (err, data) {
    res.render('klubb', {data: data})
  })
})

module.exports = router
