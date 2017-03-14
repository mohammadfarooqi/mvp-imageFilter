// var express        = require('express');
// var app            = express();
// var morgan         = require('morgan');
// // var mongoose       = require('mongoose');
// var bodyParser     = require('body-parser');
// var path = require('path');

// // configuration ===========================================

// var port = process.env.PORT || 8080; // set our port
// // mongoose.connect(mongodb://<user>:<pass>@mongo.onmodulus.net:27017/uw45mypu); // connect to our mongoDB database (commented out after you enter in your own credentials)

// // get all data/stuff of the body (POST) parameters
// app.use(morgan('dev'))
// app.use(bodyParser.json()); // parse application/json
// app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

// app.use(express.static(path.join(__dirname, '../client'))); // set the static files location /public/img will be /img for users
//   console.log(path.join(__dirname, '../client'));

// // routes ==================================================
// require('./config/routes.js')(app, express);

// // start app ===============================================
// app.listen(port);
// console.log('Magic happens on port ' + port);       // shoutout to the user
// exports = module.exports = app;             // expose app


var express = require('express');
var mongoose = require('mongoose');

var app = express();

// connect to mongo database named "shortly"
mongoose.connect('mongodb://test:test@ds131340.mlab.com:31340/filterimage');

// configure our server with all the middleware and routing
require('./config/middleware.js')(app, express);
require('./config/routes.js')(app, express);

var port = process.env.PORT || 8080;

// start listening to requests on port 8000
app.listen(port, function () {
  console.log('server up on port ' + port);
});

// export our app for testing and flexibility, required by index.js
module.exports = app;
