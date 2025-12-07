const {Socket, Server} = require('socket.io');


let clientSocket = null;

const initWebSocket = (server) => {
   const io = new Server(server, {
        cors: {
           origin: "*",
           methods: ['GET', 'POST']
    }})

    io.on("connection", (socket) => {
       console.log("Client connected:", socket.id);
       clientSocket = socket;  //store this one socket
    });

    //Register client socket globally to access it from other places
    global.clientSocket = () => clientSocket;
}

module.exports = {
    initWebSocket
}

