"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = [];
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        //@ts-ignore
        const parsedMessage = JSON.parse(message);
        console.log(parsedMessage);
        console.log(typeof (parsedMessage));
        if (parsedMessage.type === "join") {
            console.log(parsedMessage.payload.roomId);
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            });
        }
        if (parsedMessage.type == "chat") {
            //@ts-ignore
            let currentUserRoom = null;
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].socket === socket) {
                    currentUserRoom = allSockets[i].room;
                }
            }
            console.log(currentUserRoom);
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].room == currentUserRoom) {
                    console.log(parsedMessage.payload.message);
                    allSockets[i].socket.send(parsedMessage.payload.message);
                }
            }
        }
    });
    // socket.on("disconnect", () => {
    //     console.log("Client disconnected");
    //     allSockets = allSockets.filter(s => s !== socket);
    // });
});
