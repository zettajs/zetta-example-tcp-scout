# Example Zetta TCP Scout

Devices connect to port `4567` and send line delimited JSON like `{ deviceId: 'some-id', value: 1 }` where `deviceId` is some unique id used to identify the device on the network. This could be mac address or serial number.

The scout runs the tcp server on the port and listens for connections, once it gets a message it tries to find the device by `deviceId` in the registry or create a new one if it's the first time seeing it. It also stores the device instances after created with either `discover` or `provision` in order to forward the actual data to the device instance.

## Running example

```
 npm install
 node server.js &

 # Start 3 devices
 node example_device.js 1 &
 node example_device.js 2 &
 node example_device.js 3 &
```

Open zetta browser

[http://browser.zettajs.io/#/overview?url=http:%2F%2Flocalhost:3000](http://browser.zettajs.io/#/overview?url=http:%2F%2Flocalhost:3000)
