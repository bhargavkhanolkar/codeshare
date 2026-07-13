const socket = io();

let room = "";

const createBtn = document.getElementById("createRoom");
const joinBtn = document.getElementById("joinRoom");

const roomInput = document.getElementById("roomCode");

const roomLabel = document.getElementById("currentRoom");

const editor = document.getElementById("editor");

createBtn.onclick = () => {

    socket.emit("create-room");

};

socket.on("room-created",(code)=>{

    room = code;

    roomLabel.innerHTML = "Room : " + code;

});

joinBtn.onclick = ()=>{

    if(roomInput.value==="") return;

    room = roomInput.value.trim();

    socket.emit("join-room",room);

};

socket.on("room-joined",(text)=>{

    editor.value=text;

    roomLabel.innerHTML="Connected : "+room;

});

socket.on("room-error",(msg)=>{

    alert(msg);

});

editor.addEventListener("input",()=>{

    if(room==="") return;

    socket.emit("code-update",{

        room:room,

        text:editor.value

    });

});

socket.on("receive-code",(text)=>{

    editor.value=text;

});