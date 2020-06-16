const io = require('socket.io')(3000);
const users = {};
const colors = {};

io.on('connection', socket => {
    socket.on('newConnection', ({ name, chosenColor }) => {
        users[socket.id] = name;
        colors[socket.id] = chosenColor;
        socket.broadcast.emit('userConnected', { name: name, color: chosenColor });
    });
    socket.on('sendMessage', ({ messageVal, myColor }) => {
        socket.broadcast.emit('userMessage', { name: users[socket.id], message: messageVal, color: myColor } );
    });
    socket.on('disconnect', () => {
        socket.broadcast.emit('userDisconnected', users[socket.id]);
        delete users[socket.id];
    });
});