const express = require('express')
const env = require('dotenv')
const postRoute = require('./routes/postRoute')
const userRoute = require('./routes/userRoute')

require('./connection')

const app = express()
env.config();

const port = process.env.PORT || 3000;

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.use('/api/user', userRoute)
app.use('/api/post', postRoute)

app.use('*', function (req, res) {
  res.status(404).json('Invalid request');
});

app.listen(port, () => console.log(`Server is running on port ${port}`));