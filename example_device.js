var net = require('net');

var deviceId = process.argv[2] || '123';

var socket = net.createConnection({ port: 4567 }, function() {
  console.log('connected using deviceId:', deviceId);

  setInterval(function() {
    socket.write(JSON.stringify({ deviceId: deviceId, value: Math.random()*100 }) + '\n');
  }, 200)
})
