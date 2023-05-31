const mongoose = require('mongoose');

const hiveSchema = new mongoose.Schema({
  name: String,
  weight: Number,
  date: Date
});

module.exports = mongoose.model('Hive', hiveSchema);
