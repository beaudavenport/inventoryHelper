var express = require('express');
var router = express.Router();

// Get coffee list data
router.get('/coffeelist', function(req, res) {
    var db = req.db;
    db.collection('coffeelist').find().toArray(function(err, items) {
        res.json(items);
    });
});

// Get coffee blend list data
router.get('/blendlist', function(req, res) {
    var db = req.db;
    db.collection('blendlist').find().toArray(function(err, items) {
        res.json(items);
    });
});

// Get container list data
router.get('/containerlist', function(req, res) {
    var db = req.db;
    db.collection('containerlist').find().toArray(function(err, items) {
        res.json(items);
    });
});

module.exports = router;