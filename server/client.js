const net = require('net');
const client = new net.Socket();
const port = 7070;
const host = '10.11.9.4';
client.connect(port, host, function() {
  console.log('Connected');
  client.write("Hello From Client " + client.address().address + "ТЫ ПИДОР");
});

client.on('data', function(data) {
  console.log('Server Says : ' + data);
});

client.on('close', function() {
  console.log('Connection closed');
});