const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./server/db');

const app = express();

// Parsers for POST data
app.use(cors());
app.use(bodyParser.json());

// serve the whole dist folder, not just the index file so it can get the whole vuejs app
app.use(express.static('dist'))

/******************************
 GET Requests
******************************/

// GET all hives
app.get('/api/hives', async (req, res) => {
  try {
    const hives = await db.getAllHives();
    res.json(hives);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET a specific hive by id
app.get('/api/hives/:id', async (req, res) => {
  try {
    const hive = await db.getHiveById(req.params.id);
    if (!hive) {
      return res.status(404).json({ message: 'Hive id not found' });
    }
    res.json(hive);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to search all data from now til the 'date' param
app.get('/api/hives/date/:date', async (req, res) => {
  const { date } = req.params;
  try {
    const hiveData = await db.getHiveByDate(date);
    if (!hiveData) {
      return res.status(404).json({ message: 'Hive not found from date' });
    }
    res.json(hiveData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/******************************
 POST, PUT & DELETE Requests
******************************/

// ADD a new hive DATAPOINT
app.post('/api/hives', async (req, res) => {
  try {
    const hive = await db.createHive(req.body);
    res.json(hive);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE a hive
app.put('/api/hives/:id', async (req, res) => {
  try {
    const hive = await db.updateHive(req.params.id, req.body);
    if (!hive) {
      return res.status(404).json({ message: 'Hive not found' });
    }
    res.json(hive);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a hive
app.delete('/api/hives/:id', async (req, res) => {
  try {
    const hive = await db.deleteHive(req.params.id);
    if (!hive) {
      return res.status(404).json({ message: 'Hive not found' });
    }
    res.json(hive);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
