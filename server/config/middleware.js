var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');

module.exports = function (app, express) {
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true, limit: '5mb'}));
  app.use(bodyParser.json({limit: '5mb'}));
  app.use(express.static(path.join(__dirname, '../../client')));
};
