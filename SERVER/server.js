const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const {
    createRoom,
    roomExists,
    updateRoom,
    getRoomText
} = require("./rooms");

const app = express();

app.use(cors());

// Check Render file paths
console.log("Current directory:", __dirname);

const clientPath = path.join(__dirname, "../CLIENT");

console.log("CLIENT folder exists:", fs.existsSync(clientPath));
console.log(
    "index.html exists:",
    fs.existsSync(path.join(clientPath, "index.html"))
);

// Serve frontend
app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketIO(server, {
    cors: {
        origin: "*"
    }
});


function generateRoomCode() {

    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }

    return code;
}


io.on("connection", (socket) => {

    console.log("Client Connected");


    socket.on("create-room", () => {

        let code = generateRoomCode();

        while (roomExists(code)) {
            code = generateRoomCode();
        }

        createRoom(code);

        socket.join(code);

        socket.emit("room-created", code);

        console.log("Room Created:", code);

    });


    socket.on("join-room", (code) => {

        if (!roomExists(code)) {

            socket.emit(
                "room-error",
                "Room does not exist"
            );

            return;
        }

        socket.join(code);

        socket.emit(
            "room-joined",
            getRoomText(code)
        );

        console.log("Joined:", code);

    });


    socket.on("code-update", ({ room, text }) => {

        updateRoom(room, text);

        socket.to(room).emit(
            "receive-code",
            text
        );

    });


    socket.on("disconnect", () => {

        console.log("Client Disconnected");

    });

});


// Load frontend
app.get("/", (req, res) => {

    res.sendFile(
        path.join(clientPath, "index.html")
    );

});


const PORT = process.env.PORT || 3000;


server.listen(PORT, () => {

    console.log(
        `Server Running on port ${PORT}`
    );

});
    socket.on("join-room", (code) => {

        if (!roomExists(code)) {
            socket.emit("room-error", "Room does not exist");
            return;
        }

        socket.join(code);

        socket.emit("room-joined", getRoomText(code));

        console.log("Joined:", code);

    });

    socket.on("code-update", ({ room, text }) => {

        updateRoom(room, text);

        socket.to(room).emit("receive-code", text);

    });

    socket.on("disconnect", () => {

        console.log("Client Disconnected");

    });

});

// IMPORTANT: CLIENT (uppercase)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../CLIENT/index.html"));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server Running : http://localhost:${PORT}`);
});