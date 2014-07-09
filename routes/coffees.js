var mongo = require("mongodb");

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server(process.env.IP, 27017, {auto_reconnect: true});
var db = new Db('coffeedb', server);

db.open(function(err, db) {
    console.log("trying to open database...");
    if(!err) {
        console.log("Connected to 'coffeedb' database!");
        db.collection('coffees', {strict: true}, function(err, collection) {
            if(err) {
                console.log("The 'coffees' collection doesn't exist yet. Creating it...");
                populatedb();
            }
        });
    } else {
        console.log(err);
    }  
});

exports.findAll = function(req, res) {
    db.collection('coffees', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log("Retrieving coffee: " + id);
    db.collection('coffees', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.addCoffee = function(req, res) {
    var coffee = req.body;
    console.log("Adding coffee: " + JSON.stringify(coffee));
    db.collection('coffees', function(err, collection) {
        collection.insert(coffee, {safe: true}, function(err, result) {
            if (err) {
                res.send({"error":"An error has occured"});
            } else {
                console.log("Success: " + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};

exports.updateCoffee = function(req, res) {
    var coffee = req.body;
    var id = req.params.id;
    console.log("Updating coffee: " + id);
    console.log(JSON.stringify(coffee));
    db.collection('coffees', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, coffee, {safe: true}, function(err, result) {
            if (err) {
                console.log("Error updating coffee: " + err);
                res.send({"error":"An error has occured"});
            } else {
                console.log("" + result + " document(s) updated");
                res.send(coffee);
            }
        });
    });
};

exports.deleteCoffee = function(req, res) {
    var id = req.params.id;
    console.log("Deleting coffee: " + id);
    db.collection('coffees', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe: true}, function(err, result) {
            if (err) {
                res.send({"error":"An error has occured - " + err});
            } else {
                console.log("" + result + " document(s) deleted");
                res.send(req.body);
            }
        });
    });
};

var populatedb = function() {
    var coffees = [
        {
            name: "Ethiopia Yirgacheffe",
            region: "East Africa",
            beanType: "Arabica"
        },
        {
            name: "Sumatra Mandheling",
            region: "Indonesia",
            beanType: "Arabica"
        },
        {
            name: "Brazil Blahblah",
            region: "South America",
            beanType: "Robusta"
        }
    ];
    db.collection('coffees', function(err, collection) {
        collection.insert(coffees, {safe:true}, function(err, result) {});
    });
};