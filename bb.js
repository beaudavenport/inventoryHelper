var Backbone = require("backbone");
var _ = require("underscore");

// Inventory Helper Practice Script with Backbone.js

var Router = Backbone.Router.extend({
   routes: {
       '': 'home'
   }
});

var router = new Router();
router.on('route:home', function() {
    console.log("We have loaded the homepage!");
}); 