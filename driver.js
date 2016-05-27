var Device = require('zetta-device');
var util = require('util');

var Sensor = module.exports = function(opts) {
  Device.call(this);

  this.deviceId = opts.deviceId;
};
util.inherits(Sensor, Device);

Sensor.prototype.init = function(config) {
  config
    .name('Sensor-' + this.deviceId)
    .type('tcp-sensor')
    .monitor('temperature');
};

Sensor.prototype._onData = function(dataObj) {
  this.temperature = dataObj.value;
};
