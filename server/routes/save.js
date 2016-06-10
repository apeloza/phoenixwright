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
router.get('/', function(req, res) {
Save.findOne({}, function (err, savefile) {
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
