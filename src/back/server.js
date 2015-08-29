const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const routes = require('./routes.js');

const app = express();
const port = process.env.PORT || 6661;

app.use(express.static('./dist'));
app.get('/hello', (req, res) => res.send('chloe!'));

const server = app.listen(port, () =>
  console.log(`App listening at http://${server.address().address}:${port}`));
