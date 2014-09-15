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

//declare global input validation function that uses Regex to check for number with optional single decimal input, otherwise sets to "0.00"
var validateAndSet = function(model, field, value) {
    if (value !== "") {                                     //only validate if input is present (i.e., allow empty field)
        console.log(value);
        var regExp = /([0-9].[0-9])|[0-9]/;                 //"0.00" format
        console.log("regex test: " + regExp.test(value));
        if (!regExp.test(value)) {
            console.log(value + " failed the regex test!");
            model.set(field, "0.00");
        } else {
            console.log(value + " passed the regex test!");
            model.set(field, value);
        }
    } else {
        model.set(field, "");
    }
};

var resetModels = function() {
    console.log(appCollections.fetchThis());  
    console.log(coffees);
};

var syncModels = function() {
    console.log(appCollections.collectionArray);
    _.each(appCollections.collectionArray, function(collection) {
        _.each(collection.models, function(model) {
            console.log(model.id);
            model.save();
        });
    });
};


//backbone model for single-origin (unblended) coffees
var Coffee = Backbone.Model.extend({
    
    urlRoot: 'inventory/coffeelist',
    
    idAttribute: "_id",
    
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
            var changedTotal = parseFloat(model.get("greenWeight")) + parseFloat(model.get("roastedWeight"));
            if (isNaN(changedTotal)) {
                model.set("totalWeight", "0.00");
            } else {
                model.set("totalWeight", changedTotal.toFixed(2));
            }
        });
    }
});

//backbone model for coffee blends
var Blend = Backbone.Model.extend({
    
    urlRoot: 'inventory/blendlist',
    
    idAttribute: "_id",
    
    defaults: {
        name: "New Blend",
        weight: "0.00"
    },
    
    initialize: function() {
        console.log("new blend created: " + this.get("name"));
    }
});

//backbone model for containers to tare
var Container = Backbone.Model.extend({
    
    urlRoot: 'inventory/containerlist',
    
    idAttribute: "_id",
    
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
    
    //return totals of all models, excluding any invalid fields
    getTotal: function() {
        var total = {
            green: 0.00, roasted: 0.00
        };
        _.each(this.models, function(event) {
            var greenInstance = event.get("greenWeight");
            var roastedInstance = event.get("roastedWeight");
            //check for NaN, if found, ignore
            if (!isNaN(greenInstance) && greenInstance !== "") {
                console.log(event.get("greenWeight") + " is the number were adding");
                total.green += parseFloat(event.get("greenWeight"));
            }
            if (!isNaN(roastedInstance) && roastedInstance !== "") {
                total.roasted += parseFloat(event.get("roastedWeight"));    
            }
        });
        total.total = parseFloat(total.green) + parseFloat(total.roasted);
        console.log("calculated totals from collection: " + total.green + ", " + total.roasted + ", " + total.total);
        total.green = parseFloat(total.green).toFixed(2);
        total.roasted = parseFloat(total.roasted).toFixed(2);
        total.total = parseFloat(total.total).toFixed(2);
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
    
    //return totals of all models, excluding any invalid fields
    getTotal: function() {
        var total = 0.00;
        _.each(this.models, function(event) {
            var totalInstance = event.get("weight");
            if(!isNaN(totalInstance) && totalInstance !== "") {
                console.log(totalInstance + " is the number we're adding");
                total += parseFloat(totalInstance);
            }
        });
        return parseFloat(total).toFixed(2);
    },
    
    initialize: function() {
        this.getTotal();
    }
});

//establish data source for inventory container collection
var Containers = Backbone.Collection.extend({
    
    url: 'inventory/containerlist',
    
    model: Container
});

//create collection management object
var AppCollections = function() {
    
    //array to hold collections
    this.collectionArray = [];
    
    //fetch the collection passed to 'fetchThis' function, otherwise fetch all collections
    this.fetchThis = function(collection) {
        if (collection) {
            var col = _.find(this.collectionArray, collection, this);
            return col.fetch(); //return jqXHR object for use in deffered callbacks
        } else {
            var returnArray = [];
            _.each(this.collectionArray, function(col) {
                 returnArray.push(col.fetch());    
            });
            return returnArray; //return array of jqXHR objects for use in deffered callbacks
        }
    };
    //sync collections
    this.syncThis = function() {
        var returnArray = [];
        _.each(this.collectionArray, function(col) {
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
        console.log("the events for this view are: " + JSON.stringify(this.events));
        console.log(this.$el);
        this.containers = containers;
        this.collection = new CalculatorRows();
        this.$el = parent.$el.next(".calcTarget");
        console.log(this.$el);
        //pass down scope from parent view
        this.currentView = parent; 
        var calcPanelTarget = _.template($("#panelTemplate").html());
        console.log(parent);
        this.$el.html(calcPanelTarget);
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
        this.parentModel.$el.find("td").prepend(this.$el);
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

//item view for each coffee model
var coffeeItemView = Backbone.View.extend({
    
    tagName: "tr",
    
    events: {
        "click button.calculate": "renderCalculator",
        "input input.roasted": "updateModelRoasted",
        "input input.green": "updateModelGreen",
        "click button.edit": "editCoffee"
    },
    
    initialize: function() {
        this.openPanel = false; //calculator panel is not open.
        var name = this.model.get("name");
        this.output =
            "<td>" + name + "<button type='button' class='btn edit' onclick='return false'>edit</button></td>" +
            "<td><input type='text' class='green' size='8'/><button type='button' class='btn calculate' value='green' onclick='return false'>Calculate</button></td>" +
            "<td><input type='text' class='roasted' size='8'/><button type='button' class='btn calculate' value='roasted' onclick='return false'>Calculate</button></td>" +
            "<td><span class='rowTotal'></span></td>";
        console.log("Row Added.");
        this.listenTo(this.model, "all", function() {
            this.updateValues();
        }, this);
    },
    
    render: function() {
        this.$el.html(this.output);
        this.updateValues();
        return this;
    },
    
    //open calculator panel
    renderCalculator: function(event) {
                
        //prevent opening multiple calculator panels
        if (this.openPanel) {
            return false;
        }
        
        //append target row for calculator
        this.$el.after("<tr class='calcTarget'></tr>");
        console.log("the element with a calc table being appended is: ");
        console.log(this.$el);
            
        //initialize calculator view, passing it the scope of the current coffee item view as an argument
        this.openPanel = true;
        this.buttonValue = event.currentTarget.value;
        var calculatorView = new CalculatorView(this);
        //the contents of this function were previously held in a fetch().done callback
        //by placing the contents in a seperate function and calling after the initialize function
        //is complete, proper event delegation is ensured.
        calculatorView.render();
    },
    
    updateModelGreen: function(event) {
        var newValue = $(event.currentTarget).val();
        validateAndSet(this.model, "greenWeight", newValue);
        console.log("the new value is:" + this.model.get("greenWeight"));
    },
    
    updateModelRoasted: function(event) {
        var newValue = $(event.currentTarget).val();
        validateAndSet(this.model, "roastedWeight", newValue);
    },
    
    updateValues: function() {
        this.$("input.green").val(this.model.get("greenWeight"));
        this.$("input.roasted").val(this.model.get("roastedWeight"));
        this.$("span.rowTotal").text(this.model.get("totalWeight"));
    },
    
    editCoffee: function() {
        
        //prevent opening multiple calculator panels
        if(this.openPanel) {
            return false;
        }
        this.$el.after("<tr class='editTarget'></tr>");
        this.openPanel = true;
        var editPanel = new EditPanel(this);
        editPanel.render();
    }
});

var blendItemView = Backbone.View.extend({
    
    tagName: "tr",
    
    events: {
        "click button.calculate": "renderCalculator",
        "input input.blend": "updateBlends",
        "click button.edit": "editCoffee"
    },
    
    initialize: function() {
        this.openPanel = false;
        var name = this.model.get("name");
        this.output = "<td>" + name + "<button type='button' class='btn edit' onclick='return false'>edit</button></td>" +
            "<td><input type='text' class='blend' size='8' /><button type='button' class='btn calculate' value='blend' onclick='return false'>Calculate</button></td>";
        console.log("Row Added.");
        this.listenTo(this.model, "all", function() {
            this.updateValues();
        }, this);
    }, 
    
    render: function() {
        this.$el.html(this.output);
        this.updateValues();
        return this;
    },
    
    //open calculator panel
    renderCalculator: function(event) {
        
        //prevent opening multiple calculator panels
        if(this.openPanel) {
            return false;
        }
        this.$el.after("<tr class='calcTarget'></tr>");
        
        //initialize calculator view, passing it the scope of the current coffee item view as an argument
        this.openPanel = true;
        this.buttonValue = event.currentTarget.value;
        var calculatorView = new CalculatorView(this);
        calculatorView.render();
    },
    
    updateBlends: function(event) {
        var newValue = $(event.currentTarget).val();
        validateAndSet(this.model, "weight", newValue);
        console.log("the new value is: " + this.model.get("weight"));
    },
    
    updateValues: function() {
        this.$("input.blend").val(this.model.get("weight"));
    },
    
    editCoffee: function() {
        
        //prevent opening multiple calculator panels
        if(this.openPanel) {
            return false;
        }
        this.$el.after("<tr class='editTarget'></tr>");
        this.openPanel = true;
        var editPanel = new EditPanel(this);
        editPanel.render();
    }
});

//collection view for all coffee models
var CoffeeList = Backbone.View.extend({
    
    el: "tbody.viewModels",
    
    collection: coffees,
    
    initialize: function() {
        //update totals upon collection view creation and any subsequent changes
        this.updateTotals();
        this.listenTo(this.collection, "all", function() {
            console.log("collection changed.");
            this.updateTotals();
        }, this);
        
        //listen for an event triggered if the "edit" panel is called and a model in the collection is changed.
        this.listenTo(this.collection, "renderAgain", function() {
            var placeHolder = _.template($("#placeHolderTemplate").html())
            this.$el.html(placeHolder);
            this.render();
        }, this);
    },
    
    render: function() {
        console.log(this.collection);
        
        //change element to table body, remove "loading..." placeholder, and render collection
        this.setElement("tbody.viewModels");
        this.$("tr.placeHolder").remove();
        _.each(this.collection.models, function(item) {
            console.log(item);
            console.log(this.$el);
            console.log("You would add the following: " + item.get("name"));
            var newCoffeeView = new coffeeItemView({model: item});
            this.$el.append(newCoffeeView.render().$el);
        }, this);
        this.$el.append("<tr><td colspan='4'>add a coffee...<td></tr>");
        this.updateTotals();
    },

    //update vertical totals
    updateTotals: function() {
        var totals = this.collection.getTotal();
        console.log(totals);
        $('span.totalGreen').text(totals.green);
        $('span.totalRoasted').text(totals.roasted);
        $('span.total').text(totals.total); 
        console.log(totals.green + " + " + totals.roasted + " = " + totals.total);
    }
});

//Backbone view for editing inventory item
var EditPanel = Backbone.View.extend({
    
    initialize: function(parent) {
        console.log("edit panel added!");
        this.currentView = parent;
        this.model = parent.model;
        this.$el = parent.$el.next(".editTarget");
        this.output = _.template($("#editPanelTemplate").html(), {editModel: this.model});
    },
    
    render: function() {
        this.delegateEvents({
            "click .deleteModel": "deleteModel",
            "click .updateModel": "updateModel",
            "click .cancelEdit": "cancelEdit"
        });
        this.$el.html(this.output);
    },
    
    deleteModel: function() {
        console.log("this would delete the model.");
        //get local reference to model's collection before destroying
        var modelReference = this.model.collection;
        
        //trigger deletion without contacting server
        this.model.trigger("destroy", this.model);
        this.currentView.openPanel = false;
        modelReference.trigger("renderAgain");
    },
    
    updateModel: function() {
        console.log("this would update the model.");
        var newName = this.$(".editName").val();
        this.model.set("name", newName);
        this.currentView.openPanel = false;
        this.model.collection.trigger("renderAgain");
    },
    
    cancelEdit: function() {
        console.log("this would cancel the edit.");
        //set element to parent row associated with view element, reset openPanel switch and remove view
        this.setElement(this.$el.closest('tr'));
        this.currentView.openPanel = false;
        this.remove();
    }
    
});

//collection view for all blends
var BlendList = Backbone.View.extend({
    
    el: "tbody.blendModels",
    
    collection: blends,
    
    initialize: function() {
        //update totals upon collection view creation and any subsequent changes
        this.updateTotals();
        this.listenTo(this.collection, "all", function() {
            console.log("collection changed.");
            this.updateTotals();
        }, this);
        
        //listen for an event triggered if the "edit" panel is called and a model in the collection is changed.
        this.listenTo(this.collection, "renderAgain", function() {
            var placeHolder = _.template($("#placeHolderTemplate").html())
            this.$el.html(placeHolder);
            this.render();
        }, this);
    },
    
    render: function() {
        console.log(this.collection);
        
        //change element to table body, remove "loading..." placeholder, and render collection
        this.setElement("tbody.blendModels");
        this.$("tr.placeHolder").remove();
        _.each(this.collection.models, function(item) {
            console.log(item);
            console.log(this.$el);
            console.log("You would add the following: " + item.get("name"));
            var newBlendView = new blendItemView({model: item});
            this.$el.append(newBlendView.render().$el);
        }, this);
        this.$el.append("<tr><td colspan='4'>Add a blend...</td></tr>");
        this.updateTotals();
    },
    
    //update vertical fields
    updateTotals: function() {
        var total = this.collection.getTotal();
        $('span.blendTotal').text(total);
    }
});


var EditContainerList = Backbone.View.extend({
    
    el: "ul.containerListUL",
    
    collection: containers,
    
    initialize: function() {
        
    },
    
    render: function() {
        console.log("edit coffee render function called.");
        _.each(this.collection.models, function(model) {
            console.log(model.get("name") + " to be edited...");
            var editPanel = "<li><button type='button' class='btn btn-danger' onclick='return false'>Delete</button>" +
                model.get("name") + "</li>";
            this.$el.append(editPanel);
        }, this);    
    }
    
});

var mainViewForm = _.template($("#mainForm").html());

var coffeeList, blendList, router;

var Router = Backbone.Router.extend({
    
    initialize: function() {
        console.log("We have made a new router");
        
        //home page route renders inventory collections table.
        this.on('route:home', function() {
            $(".viewOne").html(mainViewForm);
            coffeeList.render();
            blendList.render();
        }); 
        
        //print route creates a printer-friendly output of the current LOCAL state of inventory collections.
        this.on('route:print', function() {
            var printablePage = _.template($("#printPageTemplate").html(), {
                printCoffees: coffees, 
                printBlends: blends
            });
            $(".viewOne").html(printablePage);
        });
        
        //edit route allows the user to edit models in all collections.
        this.on('route:edit', function() {
            var editPage = _.template($("#editInventoryTemplate").html());
            $(".viewOne").html(editPage);
            var editCoffeeList = new EditCoffeeList();
            editCoffeeList.render();
            var editBlendList = new EditBlendList();
            editBlendList.render();
            var editContainerList = new EditContainerList();
            editContainerList.render();
        });
    },
    
    routes: {
        '': 'home',
        'print': 'print',
        'edit': 'edit'
    }
});
    
//upon first visit, put collections in management array and fetch all
//once complete, begin Backbone history

appCollections.collectionArray.push(coffees);
appCollections.collectionArray.push(blends);
appCollections.collectionArray.push(containers);

$.when.apply(this, appCollections.fetchThis()).then(function() {
    
    console.log("okay, we got the stuff");
    
    //generate coffees list
    coffeeList = new CoffeeList();
    
    //generate blends list
    blendList = new BlendList();
    
    //create new router and begin navigation history
    router = new Router();
    Backbone.history.start();
});
