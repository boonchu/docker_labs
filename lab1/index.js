var os = require('os')
var express = require('express')
var app = express();

app.get('/', function(req, res) {
  var net = os.networkInterfaces();
  var msg = 'server ip: ' + net.eth0[0].address + ' cidr: ' + net.eth0[0].cidr;
  res.set('Content-Type', 'text/html');
  res.send(msg);
  res.status(200).end();
});

var server = app.listen(3000, function() {
  var server_info = {
    ip: server.address().address,
    port: server.address().port
  };
  console.log('App listening at http://%s:%s', server_info.ip, server_info.port);
});
