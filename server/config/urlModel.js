var mongoose = require('mongoose');

var UrlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  count: Number
});

module.exports = mongoose.model('urls', UrlSchema);