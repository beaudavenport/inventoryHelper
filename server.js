// node.js practice server
//
//


var express = require("express"),
    _ = require("underscore"),
    coffees = require("./routes/coffees");

var app = express();

app.configure(function() {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
});

// application REST requests

app.get('/', function(req, res) {
    var tens = _.range(0, 100, 10);
    res.send(tens);
});
app.get('/coffees', coffees.findAll);
app.get('/coffees/:id', coffees.findById);
app.post('/coffees', coffees.addCoffee);
app.put('/coffees/:id', coffees.updateCoffee);
app.delete('/coffees/:id', coffees.deleteCoffee);

app.listen(process.env.PORT);

console.log("Listening on port " + process.env.PORT);