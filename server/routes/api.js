const express = require('express');
const db = require('../db');

const app = express();

/******************************
 GET Requests
******************************/
app.get('/hives', async (req, res) => {
  try {
    const hives = await db.getAllHives();
    res.json(hives);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/hives/:id', async (req, res) => {
  try {
    const hive = await db.getHiveById(req.params.id);
    if (!hive) {
      return res.status(404).json({ message: 'Hive not found' });
    }
    res.json(hive);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


/******************************
 POST Requests
******************************/
app.post('/hives', async (req, res) => {
  try {
    const hive = await db.createHive(req.body);
    res.json(hive);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/hives/:id', async (req, res) => {
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

app.delete('/hives/:id', async (req, res) => {
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
