const rooms = new Map();

function createRoom(code) {
    rooms.set(code, {
        text: "",
        createdAt: Date.now()
    });
}

function roomExists(code) {
    return rooms.has(code);
}

function updateRoom(code, text) {
    if (rooms.has(code)) {
        rooms.get(code).text = text;
    }
}

function getRoomText(code) {
    if (rooms.has(code)) {
        return rooms.get(code).text;
    }
    return "";
}

function deleteExpiredRooms() {
    const now = Date.now();

    for (const [code, room] of rooms.entries()) {
        if (now - room.createdAt > 10 * 60 * 1000) {
            rooms.delete(code);
            console.log("Deleted room:", code);
        }
    }
}

setInterval(deleteExpiredRooms, 60000);

module.exports = {
    createRoom,
    roomExists,
    updateRoom,
    getRoomText
};