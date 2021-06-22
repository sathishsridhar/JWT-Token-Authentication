const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');

const app = express();

const port = process.env.PORT || 5000;
const uri = '<Mongodb Atlas URI>';

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Mongoose Connected');
  })
  .catch(err => {
    console.log('error ' + err);
  });

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use(express.json());
const router = require('./routes/routes.js');
app.use('/', router);
