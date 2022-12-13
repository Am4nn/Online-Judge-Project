let io = null;
const connectedUsers = [];

const registerSocketServer = server => {
    io = require("socket.io")(server, {
        cors: {
            origin: "*",
        }
    });

    // io.use(authSocket);

    io.on("connection", socket => {
        const id = socket.handshake.query.id;
        connectedUsers.push(id);
        socket.on("disconnect", () => {
            if (connectedUsers.indexOf(id) !== -1) {
                connectedUsers.splice(connectedUsers.indexOf(id), 1);
            }
        });
    })
}

const getSocketInstance = () => io;

const getConnectedUsers = () => [...connectedUsers];

module.exports = {
    Socket: { registerSocketServer, getSocketInstance, getConnectedUsers }
};
