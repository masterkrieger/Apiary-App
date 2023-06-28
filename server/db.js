const mongoose = require('mongoose');
const Hive = require('./models/hive');

// Connect to MongoDB database "apiary"
mongoose.connect('mongodb://127.0.0.1:27017/apiary', { useNewUrlParser: true, useUnifiedTopology: true });

// Define database connection error and success messages
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB database.');
});

// Function to get all hives from the database
async function getAllHives() {
  return await Hive.find().sort('-date');
}

// Function to get a specific hive by ID from the database
async function getHiveById(id) {
  return await Hive.findById(id);
}

// Function to get hive data by date
async function getHiveByDate(date) {
  const hiveData = await Hive.find({ date: { $gte: new Date(date) } }).sort('-date');
  return hiveData;
  //return hiveData.sort((a, b) => a.date > b.date );
}

// Function to create a new hive in the database
async function createHive(hive) {
  return await Hive.create(hive);
}

// Function to update an existing hive in the database
async function updateHive(id, hive) {
  return await Hive.findByIdAndUpdate(id, hive, { new: true });
}

// Function to delete a hive from the database
async function deleteHive(id) {
  return await Hive.findByIdAndDelete(id);
}

// Export all functions for use in other files
module.exports = {
  getAllHives,
  getHiveById,
  getHiveByDate,
  createHive,
  updateHive,
  deleteHive
};

