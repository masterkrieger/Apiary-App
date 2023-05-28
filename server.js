const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const Hive = require('./models/Hive')

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://10.0.0.102:27017/hives', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err))

app.get('/api/hives', async (req, res) => {
  const hives = await Hive.find()
  res.json(hives)
})

app.get('/api/hives/:id', async (req, res) => {
  const hive = await Hive.findById(req.params.id)
  res.json(hive)
})

app.post('/api/hives', async (req, res) => {
  const hive = new Hive(req.body)
  await hive.save()
  res.json(hive)
})

app.put('/api/hives/:id', async (req, res) => {
  const { id } = req.params
  const hive = await Hive.findByIdAndUpdate(id, req.body)
  res.json(hive)
})

app.delete('/api/hives/:id', async (req, res) => {
  const { id } = req.params
  const hive = await Hive.findByIdAndDelete(id)
  res.json(hive)
})

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})