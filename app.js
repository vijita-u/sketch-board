// Establishing Express Server

const express = require("express"); // Access
const socket = require("socket.io");

// Initialize the app and server is ready
const app = express();

app.use(express.static("public"));

// For our server to function, we have to make it ready to listen to requests
let port = 3000;
let server = app.listen(port, () => {
    console.log("Listening to port", port);
});

// Wrap the server inside a ws layer
let io = socket(server);

io.on("connection", (socket) => {
    console.log("Websocket connected");

    socket.on("beginPath", (data) => {
        // Transfer received data to all computers
        io.sockets.emit("beginPath", data);
    });

    socket.on("drawStroke", (data) => {
        io.sockets.emit("drawStroke", data);
    });

    socket.on("undoRedoAction", (data) => {
        io.sockets.emit("undoRedoAction", data);
    })
})