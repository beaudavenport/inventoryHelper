// Main Application javascript file


//declare global 'tare' utility function that maintains access to the original value
var tare = function(gross) {
    var original = gross;
    return {
        taredVal: function(tare) {
           return (gross >= tare) ? (gross - tare) : 0;
        },
        originalVal: function() {
            return original;
        }
    };
};

//declare global input validation function that trims input and detects sets model to 0 if NaN detected
var validateNumInput = function(model, field) {
    if (model.get(field) !== "") {                      //only validate if input is present (i.e., allow backspace button)
        var trimmedField = String(model.get(field));
        trimmedField = trimmedField.trim();
        model.set(field, parseFloat(trimmedField));
        console.log(model.get(field));
        if (isNaN(model.get(field))) {
            model.set(field, 0.00);
        }
    }
};

var resetModels = function() {
    console.log(appCollections.fetchThis());  
    console.log(coffees);
};

//backbone model for single-origin (unblended) coffees
var Coffee = Backbone.Model.extend({
    defaults: {
        name: "New Coffee",
        origin: "Origin",
        greenWeight: "0.00",
        roastedWeight: "0.00",
        totalWeight: "0.00",
    },
    initialize: function() {
        console.log("New coffee model created: " + this.get("name") + ": " + this.get("totalWeight"));
        this.on("change", function(model) {
            validateNumInput(model, "greenWeight");
            validateNumInput(model, "roastedWeight");
            var changedTotal = parseFloat(model.get("greenWeight")) + parseFloat(model.get("roastedWeight"));
            model.set("totalWeight", changedTotal.toFixed(2));
        });
    }
});

//backbone model for coffee blends
var Blend = Backbone.Model.extend({
    defaults: {
        name: "New Blend",
        weight: "0.00"
    },
    initialize: function() {
        console.log("new blend created: " + this.get("name"));
        this.on("change", function(model) {
            validateNumInput(model, "weight");
        });
    }
});

//backbone model for containers to tare
var Container = Backbone.Model.extend({
    defaults: {
        name: "New Container",
        weight: "0.00"
    }
});

//backbone model for local collections that don't sync with server
var LocalModel = Backbone.Model.extend({});
LocalModel.prototype.sync = function() { return false; };
LocalModel.prototype.fetch = function() { return false; };
LocalModel.prototype.save = function() { return false; };



//local backbone model for rows in calculator that get tared
var CalculatorRow = LocalModel.extend({
    defaults: {
        name: "New Row",
        weight: "0.00"
    },
    initialize: function() {
        console.log("new calculator row here: ");
        var parsedWeight = parseFloat(this.get("weight"));
        this.tareFunction = tare(parsedWeight);
    }
});

var CalculatorRows = Backbone.Collection.extend({
    
    model: CalculatorRow,
    
    newTotal: 0.00,
    
    initialize: function() {
        console.log("new calculator row collection!!");
        
        //any change to the collection triggers an update of the total.
        this.on("all", function() {
            var total = 0.00;
            _.each(this.models, function(event) {
                total += parseFloat(event.get("weight"));
            });
            this.newTotal = total.toFixed(2);
        }, this);
        
    }
    
});

//establish data source for coffee collection
var Coffees = Backbone.Collection.extend({
    url: 'inventory/coffeelist',
    model: Coffee,
    getTotal: function() {
        var total = {
            green: 0.00, roasted: 0.00
        };
        _.each(this.models, function(event) {
            total.green += parseFloat(event.get("greenWeight"));
            total.roasted += parseFloat(event.get("roastedWeight"));
        });
        total.total = parseFloat(total.green) + parseFloat(total.roasted);
        console.log("calculated totals from collection: " + total.green + ", " + total.roasted + ", " + total.total);
        return total;
    },
    initialize: function() {
        this.getTotal();
    }
});

//establish data source for coffee blends collection
var Blends = Backbone.Collection.extend({
    url: 'inventory/blendlist',
    model: Blend,
    getTotal: function() {
        var total = 0.00;
        _.each(this.models, function(event) {
            total += parseFloat(event.get("weight"));
        });
        return total;
    }
});

//establish data source for inventory container collection
var Containers = Backbone.Collection.extend({
    url: 'inventory/containerlist',
    model: Container
});

//create collection management object
var AppCollections = function() {
    
    //create new collections
    var collectionArray = [];
    this.addCollection = function(collection) {
        collectionArray.push(collection);
    };
    this.removeCollection = function(collection) {
        collectionArray.pop(collection);
    };
    this.getCollection = function(collection) {
        return _.find(collectionArray, collection);
    };
    
    //fetch the collection passed to 'fetchThis' function, otherwise fetch all collections
    this.fetchThis = function(collection) {
        if (collection) {
            var col = _.find(collectionArray, collection, this);
            return col.fetch(); //return jqXHR object for use in deffered callbacks
        } else {
            var returnArray = [];
            _.each(collectionArray, function(col) {
                 returnArray.push(col.fetch());    
            });
            return returnArray; //return array of jqXHR objects for use in deffered callbacks
        }
    };
    //sync collections
    this.syncThis = function() {
        var returnArray = [];
        _.each(collectionArray, function(col) {
            returnArray.push(col.sync());
        });
        return returnArray;
    };
};

var appCollections = new AppCollections(),
    coffees = new Coffees(),
    blends = new Blends(),
    containers = new Containers();

    
//backbone view for calculator panel
var CalculatorView = Backbone.View.extend({

    //initialize function with parent view's scope and calculate subtotal
    initialize: function(parent) {
   
        console.log(this);
        console.log("the events for this view are: " + this.events.toString());
        console.log(this.$el);
        this.containers = containers;
        this.collection = new CalculatorRows();
        
        //pass down scope from parent view
        this.currentView = parent; 
        var calcPanelTarget = _.template($("#panelTemplate").html());
        this.$el.after(calcPanelTarget);
        
        //set view element to newly added table
        var newElement = this.$el.closest("tr").next("tr").find(".calcPanelTable");

        this.setElement(newElement);
        console.log("the element was successfully changed to: " + this.$el);
        console.log("We reached the end of the function...");

    },
    events: {
        "click .addRow": "renderAdditional",
        "click .done": "returnPanel",
        "click .cancel": "cancelPanel"
    },
    render: function() {
        console.log("render function called.");
        
        //attach list of containers to coffee item model as well as which value is associated with the calculator button pressed
        this.currentView.model.set("containers", this.containers);
        this.currentView.model.set("buttonValue", this.currentView.buttonValue);
        this.delegateEvents({
        "click .addRow": "renderAdditional",
        "click .done": "returnPanel",
        "click .cancel": "cancelPanel"
        });
        
        //render new calculator row, passing in current model on rendering for access within view
        var newRow = new calculatorRowView({model: new CalculatorRow()});
        newRow.render(this);
        console.log(this.currentView.model.get("name"));
        
        //add listener for changes to collection and update running total field
        this.listenTo(this.collection, "all", function() {
            this.updateRunningTotal();
        });
        return this;
    },
    renderAdditional: function() {
        var newRow = new calculatorRowView({model: new CalculatorRow()});
        newRow.render(this);
        console.log("this is what this is:" + this);
    },
    returnPanel: function() {
        console.log("returning panel.");
        console.log(this.model.get("buttonValue"));
        //set correct weight of passed-in view's model based on which button pressed
        switch (this.model.get("buttonValue")) {
            case "green":
                this.model.set("greenWeight", this.collection.newTotal);
                break;
            case "roasted":
                this.model.set("roastedWeight", this.collection.newTotal);
                break;
            case "blend":
                this.model.set("weight", this.collection.newTotal);
                break;
            default:
                return 0;
        }
        console.log(this.model.buttonValue + ": " + this.collection.newTotal);
        
        //set element to parent row associated with view element, reset openPanel switch and remove view
        this.setElement(this.$el.closest('tr'));
        this.currentView.openPanel = false;
        this.remove();
    },
    cancelPanel: function() {
        //set element to parent row associated with view element, reset openPanel switch and remove view
        this.setElement(this.$el.closest('tr'));
        this.currentView.openPanel = false;
        this.remove();
    },
    updateRunningTotal: function() {
        console.log(this.el);
        this.$(".calcTotal").text(this.collection.newTotal);
    }
});

//item view for each calculator row
var calculatorRowView = Backbone.View.extend({
    tagName: "tr",
    
    events: {
        "click .tareButton": "tare",
        "click .deleteRow": "delete",
        "click .clearTare": "clearTare",
        "change .calcGross": "updateTare"
    },
    initialize: function() {
        console.log("new calculator row view added...");

    },
    render: function(parentModel) {
        console.log("new calculator row appended!" +  " " + parentModel.model.get("name"));
        //add new calculator row model to collection
        parentModel.collection.add(this.model);
        console.log(parentModel.collection);
        
        //attach coffee model passed in render function as parent model for current view
        this.parentModel = parentModel;
        this.calcPanel = _.template($("#calcTemplate").html(), {calcModel: this.parentModel.model});
        this.$el.html(this.calcPanel);
        this.parentModel.$el.prepend(this.$el);
        console.log(this.el);
        
        //declare DOM constants for easy access
        this.inputField = this.$(".calcGross");
        this.inputField.val(this.model.get("weight"));
    },
    tare: function(event) {
        //highlight current tare when clicked 
        console.log(this.model.get("weight"));
        $(event.currentTarget).addClass("btn-danger");
        $(event.currentTarget).siblings(".tareButton").removeClass("btn-danger");
        $(event.currentTarget).siblings(".clearTare").removeClass("btn-danger");

        console.log(this.inputField);
        var tareWeight = parseFloat(event.currentTarget.value);
        
        //get tared weight from model
        var newTare = this.model.tareFunction.taredVal(tareWeight);
        this.model.set("weight", newTare);
        this.inputField.val(this.model.get("weight"));
        console.log(this.model.get("weight"));
    },
    updateTare: function(event) {
        var value = parseFloat(event.currentTarget.value);
        //attach tare function to model
        this.model.tareFunction = tare(value);
    },
    clearTare: function(event) {
        $(event.currentTarget).addClass("btn-danger");
        $(event.currentTarget).siblings(".tareButton").removeClass("btn-danger");
        var original = this.model.tareFunction.originalVal();
        this.model.set("weight", original);
        this.inputField.val(original);
    },
    delete: function() {
        console.log("Delete this row");
        var deleted = this.parentModel.collection.remove(this.model);
        
        //if row to delete is the last remaining row, automatically cancel panel
        if (this.parentModel.collection.length < 1) { 
            this.parentModel.cancelPanel();
        }
        console.log(deleted);
        this.remove();
    }
});

//epoxy item view for each coffee model
var coffeeItemView = Backbone.Epoxy.View.extend({
    tagName: "tr",
    
    bindings: {
        "input.green": "value:greenWeight,events:['keyup']",
        "input.roasted": "value:roastedWeight,events:['keyup']",
        "span.rowTotal": "text:totalWeight,events:['keyup']"
    },
    
    events: {
        "click button.calculate": "renderCalculator"
    },
    
    initialize: function() {
        this.openPanel = false;
        var name = this.model.get("name");
        var output = "<td>" + name + "</td>" +
            "<td><input type='text' class='green'/><button type='button' class='btn calculate' value='green' onclick='return false'>Calculate</button></td>" +
            "<td><input type='text' class='roasted'/><button type='button' class='btn calculate' value='roasted' onclick='return false'>Calculate</button></td>" +
            "<td><span class='rowTotal'></span></td>";
        this.$el.append(output);
        console.log("Row Added.");
    },
    
    //open calculator panel
    renderCalculator: function(event) {
        if (this.openPanel)
            return false;
        //initialize calculator view, passing it the scope of the current coffee item view as an argument
        this.openPanel = true;
        this.buttonValue = event.currentTarget.value;
        var calculatorView = new CalculatorView(this);
        //the contents of this function were previously held in a fetch().done callback
        //by placing the contents in a seperate function and calling after the initialize function
        //is complete, proper event delegation is ensured.
        calculatorView.render();
    }
});

var blendItemView = Backbone.Epoxy.View.extend({
    tagName: "tr",
    
    bindings: {
        "input.blend": "value:weight,events:['keyup']"
    },
    
    events: {
        "click button.calculate": "renderCalculator"
    },
    
    initialize: function() {
        this.openPanel = false;
        var name = this.model.get("name");
        var output = "<td>" + name + "</td>" +
            "<td><input type='text' class='blend'/><button type='button' class='btn calculate' value='blend' onclick='return false'>Calculate</button></td>";
        this.$el.append(output);
        console.log("Row Added.");
    }, 
    
    //open calculator panel
    renderCalculator: function(event) {
        if(this.openPanel)
            return false;
        //initialize calculator view, passing it the scope of the current coffee item view as an argument
        this.openPanel = true;
        this.buttonValue = event.currentTarget.value;
        var calculatorView = new CalculatorView(this);
        calculatorView.render();
    }
});

//epoxy collection view for all coffee models
var CoffeeList = Backbone.Epoxy.View.extend({
    
    el: "tbody.viewModels",
    
    collection: coffees,
    
    itemView: coffeeItemView,
    
    initialize: function() {
        this.updateTotals();
        this.listenTo(this.collection, "all", function() {
            console.log("collection changed.");
            this.updateTotals();
        }, this);
    },
    events: {
        "mouseover input": "consoleThis"
    },
    
    //update vertical totals
    updateTotals: function() {
        var totals = this.collection.getTotal();
        console.log(totals);
        $('span.totalGreen').text(totals.green.toFixed(2));
        $('span.totalRoasted').text(totals.roasted.toFixed(2));
        $('span.total').text(totals.total.toFixed(2)); 
        console.log(totals.green + " + " + totals.roasted + " = " + totals.total);
    },
    //Console Log the current target of the "event" object returned when a mouseover input event occurs.
    consoleThis: function(event) {
        var thisField = $(event.currentTarget);
        console.log('You moused over ' + thisField.val());
    }

});

//epoxy collection view for all blends
var BlendList = Backbone.Epoxy.View.extend({
    
    el: "tbody.blendModels",
    
    collection: blends,
    
    itemView: blendItemView,
    
    initialize: function() {
        this.updateTotals();
        this.listenTo(this.collection, "all", function() {
            console.log("collection changed.");
            this.updateTotals();
        }, this);
    },
    
    events: {
        "keyup input": "updateTotals"
    },
    
    updateTotals: function() {
        var total = this.collection.getTotal();
        $('span.blendTotal').text(total.toFixed(2));
    }
});

var Router = Backbone.Router.extend({
    routes: {
        '': 'home',
        'test': 'test'
    }
});

var router = new Router();
router.on('route:home', function() {
    console.log("We have loaded the homepage!");
    var mainViewForm = _.template($("#mainForm").html());
    $(".viewOne").append(mainViewForm);
    // upon successful fetching of data, render calculator homepage
    appCollections.addCollection(coffees);
    appCollections.addCollection(blends);
    appCollections.addCollection(containers);
    console.log(appCollections.collectionArray);
    $.when.apply(this, appCollections.fetchThis()).then(function() {
        console.log("okay, we got the stuff");
        //generate coffees list
        var coffeeList = new CoffeeList();
        
        //generate blends list
        var blendList = new BlendList();   
    });

}); 

router.on('route:test', function() {
    console.log("Test page!");
    $(".viewOne").html("<p>testing...</p>");
    $(".viewOne").append("<h1>The state of the page...</h1>");
    _.each(loadCollections, function(event) {
        _.each(event.models, function(event) {
            $(".viewOne").append("<p>" + JSON.stringify(event) + "</p>");
        });
    });
});

//begin Backbone history
Backbone.history.start();

