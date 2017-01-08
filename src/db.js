// Database
var mongo = require('mongoskin');

module.exports = mongo.db(process.env.MONGOLAB_URI || 'mongodb://localhost/inventoryHelper', {native_parser:true});
