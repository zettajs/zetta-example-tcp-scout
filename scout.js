var net = require('net');
var util = require('util');
var Scout = require('zetta-scout');
var Driver = require('./driver');

var TCPScout = module.exports = function() {
  Scout.call(this);
}
util.inherits(TCPScout, Scout);

TCPScout.prototype.init = function(next) {
  var self = this;
  var deviceCache = {}; // <deviceId>: driverInstance
  
  var tcpServer = net.createServer(function(socket) {
    socket.on('data', function(buffer) {

      // The protocol is a simple line delimited JSON
      buffer
        .toString()
        .split('\n')
        .map(function(line) {
          try {
            return JSON.parse(line);
          } catch (err) {
            return null;
          }
        })
        .filter(function(msg) {
          return msg !== null;
        })
        .forEach(function(msg) {

          // Check device cache if we've already setup driver just pass the data to it.
          if (deviceCache[msg.deviceId]) {
            deviceCache[msg.deviceId]._onData(msg);
            return;
          }

          // Find a tcp-sensor that has deviceId that matches the messages deviceId
          // We CANNOT use `id` here because zetta generates a unique uuid for id per device
          var query = self.server.where({ type: 'tcp-sensor', deviceId: msg.deviceId });
   
          self.server.find(query, function(err, results) {
            if (results.length > 0) {
              // found in registry, tell zetta it came online
              var device = self.provision(results[0], Driver, msg);
            } else {
              // does not exist in registry, discover a new one.
              var device = self.discover(Driver, msg);
            }

            // self.provision will return null if the device is already inititated.
            // so we must check if we have a device.
            if (device) {
              // Save to cache so we don't have to do a disk lookup of the driver instance
              deviceCache[msg.deviceId] = device;
              
              // Pass data to driver instance
              device._onData(msg);
            }
          });
          
        })
    })
  });
  
  tcpServer.listen(4567, next);
};

