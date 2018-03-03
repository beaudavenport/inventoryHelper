var monk = require('monk');
module.exports = monk(process.env.MONGOLAB_URI || 'mongodb://localhost/inventoryHelper');
