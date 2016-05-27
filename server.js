var zetta = require('zetta');
var TcpScout = require('./scout');

zetta()
  .use(TcpScout)
  .listen(3000);
