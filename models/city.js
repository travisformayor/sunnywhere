const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitySchema = new Schema({
  name: String,
  woeid: Number,
  entryDate: Date,
  type: String,
  typeShorthand: String 
})

const City = mongoose.model('City', CitySchema);
module.exports = City;
