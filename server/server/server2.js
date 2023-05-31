// Importing required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Creating express app
const app = express();

// Setting up middleware
app.use(cors());
app.use(bodyParser.json());

// Connecting to MongoDB database
//mongoose.connect('mongodb://10.0.0.102:27017/apiary', {
mongoose.connect('mongodb://127.0.0.1:27017/apiary', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Creating mongoose schema
const hiveSchema = new mongoose.Schema({
    name: String,
    weight: Number,
    date: Date
});

// Creating mongoose model
const Hive = mongoose.model('Hive', hiveSchema);

// Serve the Vue app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});


// Creating API endpoints
app.get('/api/hives', async (req, res) => {
    try {
        const hives = await Hive.find();
        res.json(hives);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/hives', async (req, res) => {
    const hive = new Hive({
        name: req.body.name,
        weight: req.body.weight,
        date: req.body.date
    });

    try {
        const newHive = await hive.save();
        res.status(201).json(newHive);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.get('/api/hives/:id', getHive, (req, res) => {
    res.json(res.hive);
});

app.patch('/api/hives/:id', getHive, async (req, res) => {
    if (req.body.name != null) {
        res.hive.name = req.body.name;
    }

    if (req.body.weight != null) {
        res.hive.weight = req.body.weight;
    }

    if (req.body.date != null) {
        res.hive.date = req.body.date;
    }

    try {
        const updatedHive = await res.hive.save();
        res.json(updatedHive);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/hives/:id', getHive, async (req, res) => {
    try {
        await res.hive.remove();
        res.json({ message: 'Hive deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getHive(req, res, next) {
    let hive;

    try {
        hive = await Hive.findById(req.params.id);

        if (hive == null) {
            return res.status(404).json({ message: 'Cannot find hive' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.hive = hive;
    next();
}

// Starting server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
