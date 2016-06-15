var express = require('express');
var router = express.Router();
var Save = require('../models/save');
var path = require('path');

router.post('/', function(req, res) {
    var savefile = new Save(req.body);
    savefile.save(function(err) {
        if (err) {
            res.sendStatus(500);
            console.log(err);
            return;
        }
        res.sendStatus(201);
    });
});
router.get('/all/:id', function(req, res){
  console.log(req.body);
  Save.find({'caseNum': req.params.id}, function (err, saves){
    if (err) {
      res.sendStatus(500);
      console.log(err);
      return;
    }
    console.log(saves);
    res.send(saves);
  });
});

router.delete('/:id', function(req, res) {
  Save.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    res.sendStatus(201);
});
});
router.get('/:id', function(req, res) {
Save.findById(req.params.id, function (err, savefile) {
  if (err) {
    res.sendStatus(500);
    console.log(err);
    return;
  }
console.log(savefile);
  res.send(savefile);
});
});

module.exports = router;
