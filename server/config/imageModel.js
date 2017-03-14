var mongoose = require('mongoose');

var ImageSchema = new mongoose.Schema({
  image: String
});

module.exports = mongoose.model('images', ImageSchema);