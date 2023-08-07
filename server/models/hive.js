const mongoose = require('mongoose');

const hiveSchema = new mongoose.Schema({
  name: String,
  weight: Number,
  date: Date,
  firmware_version: String,
  battery: Number
});

module.exports = mongoose.model('Hive', hiveSchema);
