var express = require('express');
var characters = require('../public/assets/json/tutorialcase/characters');
var router = express.Router();
var scenes = require('../public/assets/json/tutorialcase/scenes');
var evidence = require('../public/assets/json/tutorialcase/evidence');
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
