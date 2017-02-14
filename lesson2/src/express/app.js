var express = require('express');
var app = express();

app.set('view engine', 'ejs');

var myName = "Casper Oakley";

app.get('/', function (req, res) {
  res.render('index', {name: myName});
});

app.get('/name/:newName', function(req, res) {
  res.send("Name changed from " + myName + " to " + req.params.newName);
  myName = req.params.newName;
});

app.listen(3000, function () {
  console.log('Listening on port 3000')
});

