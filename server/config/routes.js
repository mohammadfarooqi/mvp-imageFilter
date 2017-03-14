var helpers = require('./helpers.js');
var path = require('path');
var request = require('request');
var Url = require('./urlModel.js');

module.exports = function (app, express) {
  app.post('/api/image', function (req, res) {
    request({url: req.body.url, encoding: null}, function (error, response, body) {
      if (error) {
        throw error;
      }

      var data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
      //console.log(data);

      Url.where({url: req.body.url}).findOne(function (err, url) {
        if (err) {
          throw error;
        }

        if (!url) {
          var u = new Url({url: req.body.url, count: 1});
          u.save(function (err) {
            if (err) {
              throw err;
            } else {
              console.log('url inserted');
            }
            res.send(data);
          });
        } else {
          url.count = url.count + 1;
          url.save(function (err) {
            if (err) {
              throw err;
            } else {
              console.log('updated counter');
            }
            res.send(data);
          });
        }
      });
    });
  });

  app.get('/api/urls', function (req, res) {
    Url.find({}, 'url count', function (err, urls) {
      if (err) {
        throw err;
      }

      res.send(urls);
    })
  });

  // app.get('*', function(req, res) {
  //   res.sendFile(path.join(__dirname, '../../client/index.html'));
  // });

  // If a request is sent somewhere other than the routes above,
  // send it through our custom error handler
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);
};