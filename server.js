const express = require('express');
const {Server} = require('socket.io');
const ACTIONS = require('./src/Actions.js')
const path = require('path');

const app = express();
const http = require('http');
const server = http.createServer(app);

app.use(express.static('build'));// deploy purpose
// to handle server calls directing to index.htl for deploy purpose
app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'build','index.html'));
})

const io = new Server(server);

const userSocketMap = {};

function getAllConnectedClients(roomId){
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{
        return{
            socketId,
            user : userSocketMap[socketId]
        }
    })
}

io.on('connection' , (socket)=>{
    console.log("Connection established!");

    socket.on(ACTIONS.JOIN, ({roomId,username})=>{
        // console.log(roomId,username);
        userSocketMap[socket.id] = username;
        socket.join(roomId);

        const clients = getAllConnectedClients(roomId);
        // console.log(clients);

        clients.forEach(({socketId})=>{
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                user : username,
                socketId : socket.id
            })
        })
        

    })

    socket.on(ACTIONS.CODE_CHANGE, ({roomId,code})=>{
        socket.to(roomId).emit(ACTIONS.CODE_CHANGE, {code});
    })
    socket.on(ACTIONS.SYNC_CODE, ({code , socketId})=>{
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, {code});
    })

    socket.on('disconnecting' , ()=>{
        const rooms = [...socket.rooms];
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId : socket.id,
                user : userSocketMap[socket.id]
            })
        })
        delete userSocketMap[socket.id];
        socket.leave();
    })


})


server.listen(8015, ()=>{
    console.log("Running" , 8015);
})