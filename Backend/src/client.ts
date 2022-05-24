import { io } from "socket.io-client";

const socket = io("ws://locahost:3000");

// Recieve a message from the server
socket.on("hello", (arg) => {
    console.log(arg); // Prints "world"
});

// Send a message to the server
socket.emit("howdy", "stranger");

