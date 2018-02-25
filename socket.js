
module.exports = function(server) {
  console.log('Trying to make run web socket server!!!');

  var io = require('socket.io').listen(server);

  global.io = io;

  users = [];
  connections = [];
  io.sockets.on('connection', function(socket) {
    connections.push(socket)    
    console.log(`connected socket ${socket} - [ ${ connections.length } ]`)

    socket.on('disconnect', function(data){
      connections.splice(connections.indexOf(socket), 1);
      console.log(`Disconnected socket - [ ${connections.length} ]`);
    });

    socket.on('new user', function(data, callback) {
      callback({
        success: true,
        newUser: data
      });
      console.log(data);
      updateAllClients();

    });
    function updateAllClients() {
      io.sockets.emit('new user', {});
    }
  });



}