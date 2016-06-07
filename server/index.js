var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var game = require('./routes/game');

app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.json());

app.use('/game', game);

app.get('/*', function(req, res) {
  console.log('request params', req.params);
var file = req.params[0] || 'views/index.html';
res.sendFile(path.join(__dirname, "./public", file));
});

app.listen(app.get('port'), function() {
  console.log("Server is ready on port:" + app.get('port'));
});
