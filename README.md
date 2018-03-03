inventoryHelper
===============

A javascript-stack inventory application for calculating weights and totals of coffee.

Inventory Helper is a web-based application that makes it easier to calculate weights and totals of coffee in a coffee roasting facility. Users add specific coffees to a collection of coffee models, and input the weights of green (unroasted) and roasted coffee for each model. The application automatically updates the totals for all input fields, and allows a "calculate" view that renders a panel for measuring multiple containers of the same coffee. This panel allows the user to specify what container the target coffee is stored in, automatically factoring in the weight of the specified container, and when finished updates the input field with the calculated weight. The weights of these containers, like the list of coffees, are user-defined. Finally, a "save" function updates the database with the current values for each coffee. A "clear" function clears all fields.

## Version 2.0.0 Changes
___Version 1.0.0 still available at {baseUrl}/v1___

Inventory Helper 2.0.0 features a re-implementation of the client application in React and Redux, with some updated styling and the ability to use the application without logging in. It introduces an updated toolset as well, utilizing Webpack, ES6 transpiled with Babel, and a testing suite with Mocha, Sinon and Enzyme.

Version 2.0.0 introduces API support for the legacy app as well as the V2 re-write, and includes benefits from functional tests with Supertest and some refactoring to leverage ES6.

### Version 1.0.0

Inventory Helper is a full-stack javascript application, with a node.js and Express back-end, and a client-side MV* structure using Backbone.js and Bootstrap.

### Windows dev notes ###
To set env variable to jwtString in powershell locally:

`$env:jwtString = 'foo'`

To setup initial mongodb db:

`use inventoryHelper`
