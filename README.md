inventoryHelper
===============

A javascript-stack inventory application for calculating weights and totals of coffee.

Inventory Helper is a web-based application that makes it easier to calculate weights and totals of coffee in a coffee roasting facility. Users add specific coffees to a collection of coffee models, and input the weights of green (unroasted) and roasted coffee for each model. The application automatically updates the totals for all input fields, and allows a "calculate" view that renders a panel for measuring multiple containers of the same coffee. This panel allows the user to specify what container the target coffee is stored in, automatically factoring in the weight of the specified container, and when finished updates the input field with the calculated weight. The weights of these containers, like the list of coffees, are user-defined. Finally, a "save" function updates the database with the current values for each coffee. A "clear" function clears all fields.

Inventory Helper is a full-stack javascript application, with a node.js and Express back-end, and a client-side MV* structure using Backbone.js and Bootstrap.
