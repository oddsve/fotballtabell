var express = require('express')
  , router = express.Router()
  , Terminliste = require('../models/terminliste')
  

router.get('/:id', function(req, res) {
  console.log("start");
  Terminliste.get(req.params.id, function (err, terminliste) {
    res.render('tabell', {lagsliste: terminliste})
  })
})

module.exports = router
