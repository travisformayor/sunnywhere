const mongoose = require('mongoose');
const DB_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/sunnywhere';

mongoose.connect(DB_URL, {useNewUrlParser: true, useFindAndModify: false})
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.log(err));

module.exports = {
  City: require('./city')
};
