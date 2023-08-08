const mongoose = require('mongoose');

const hiveSchema = new mongoose.Schema({
  name: String,
  weight: Number,
  date: Date,
  firmware_version: String,
  time: Number,
  battery: Number
});

module.exports = mongoose.model('Hive', hiveSchema);
