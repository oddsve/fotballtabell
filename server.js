var express = require('express');
var app = express();

app.engine('jade', require('jade').__express)
app.set('view engine', 'jade')

//app.use(require('./middlewares/users'))
app.use(express.static('public'))
app.use(require('./controllers'))

app.get('/', function (req, res) {
   res.send('Hello World');
})

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;


var server = app.listen(80, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})
