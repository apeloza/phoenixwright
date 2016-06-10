var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var game = require('./routes/game');
var save = require('./routes/save');
app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.json());

app.use('/game', game);
app.use('/save', save);

app.get('/*', function(req, res) {
  console.log('request params', req.params);
var file = req.params[0] || 'views/index.html';
res.sendFile(path.join(__dirname, "./public", file));
});

var databaseURI = 'mongodb://apeloza:anthony@ds013004.mlab.com:13004/soloprojectsaves';
mongoose.connect(databaseURI);
mongoose.connection.on('connected', function () {
  console.log('Mongoose connection open ', databaseURI);
});
mongoose.connection.on('error', function (err) {
  console.log('Mongoose error connecting ', err);
});
app.listen(app.get('port'), function() {
  console.log("Server is ready on port:" + app.get('port'));
});
