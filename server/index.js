import dotenv from 'dotenv';
import csv from 'csv-parser';
import moment from 'moment';
import fs from 'fs';
import path from 'path';
import express from 'express';
import http from 'http';
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);

// app configuration
dotenv.config({
  path: path.join(__dirname, '../config/.env'),
});
const PORT = process.env.PORT || 3000;
var data = {};
// static directory
app.use(express.static(path.join(__dirname, '../public')));

// GET method route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/portrait.html'));
});
app.get('/landscape', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/landscape.html'));
});

// server listening
server.listen(PORT, function () {
  console.log(`Server is listening on port ${PORT}`);
});


// When a client connects, we note it in the console
io.on('connection', socket => {
  // initial data
  treasure.lastFive();
  treasure.totalTreasuresFound(socket);
  data['lastFiveMinuteFound'] = 0;
  // send message to client with data
  socket.emit('treasures', data);

  // received update event from client after time
  socket.on('update', () => {
    treasure.lastFive();
    treasure.lastFiveMinuteFound(socket);
  });
  socket.on('disconnect', () => {
    console.log('Disconnected');
  });
});


// object
var treasure = {
  totalTreasuresFound: function (socket) {
    let totalFound = 0;
    fs.createReadStream(process.env.TOTAL_TREASURE_FOUND)
      .pipe(csv(['total']))
      .on('data', function (data) {
        totalFound = data.total;
      })
      .on('end', function () {
        // send message to client with data
        socket.emit('crashscenario', totalFound);
      });
  },
  lastFive: function () {
    let This = this;
    let loots = [];
    fs.createReadStream(process.env.FIVE_ISLANDS)
      .pipe(csv(['id', 'points', 'date']))
      .on('data', function (data) {
        data.points = This.format(data.points);
        data.date = moment(data.date, ["YYYY-MM-DD"]).format("Do MMM YYYY");
        loots.push(data);
      })
      .on('end', function () {
        data['lastFive'] = loots;
      });
  },
  lastFiveMinuteFound: function (socket) {
    let totalFound = 0;
    fs.createReadStream(process.env.LAST_FIVE_MINUTE_TREASURE_FOUND)
      .pipe(csv(['total']))
      .on('data', function (data) {
        totalFound = data.total;
      })
      .on('end', function () {
        data['lastFiveMinuteFound'] = totalFound;
        // send message to client with data
        socket.emit('treasures', data);
      });
  },
  format: function (value) {
    var parts = (+value).toFixed(2).split('.');
    var num = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (+parts[1] ? '.' + parts[1] : '');
    return num;
  },
};