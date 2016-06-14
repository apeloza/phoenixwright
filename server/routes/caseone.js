var express = require('express');
var characters = require('../public/assets/json/caseone/characters');
var router = express.Router();
var scenes = require('../public/assets/json/caseone/scenes');
var evidence = require('../public/assets/json/caseone/evidence');
router.get('/characters/', function(req, res) {
res.send(characters);
});

router.get('/scenes/', function(req, res) {
res.send(scenes);
});

router.get('/evidence/', function(req, res) {
  res.send(evidence);
});
module.exports = router;
