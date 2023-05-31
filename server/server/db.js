const mongoose = require('mongoose');
const Hive = require('./models/hive');

mongoose.connect('mongodb://127.0.0.1:27017/apiary', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB database.');
});

function getAllHives() {
  return Hive.find();
}

function getHiveById(id) {
  return Hive.findById(id);
}

// Function to get hive data by date
async function getHiveByDate(date) {
  const hiveData = await Hive.find({ date: { $gte: date } });
  return hiveData;
}

function createHive(hive) {
  return Hive.create(hive);
}

function updateHive(id, hive) {
  return Hive.findByIdAndUpdate(id, hive, { new: true });
}

function deleteHive(id) {
  return Hive.findByIdAndDelete(id);
}

module.exports = {
  getAllHives,
  getHiveById,
  getHiveByDate,
  createHive,
  updateHive,
  deleteHive
};

