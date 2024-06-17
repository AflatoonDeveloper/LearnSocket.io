import express from "express"
import { Server } from "socket.io";
import {createServer} from "http"
import cors from "cors"


const app = express();
const server = createServer(app);
const port = 3000;

const io = new Server(server,
    {
        cors:{
            origin:"*",
            methods:["POST","GET"],
            credentials:true,
        }
    }
)

app.use(cors({
    cors:{
        origin:"*",
        methods:["POST","GET"],
        credentials:true,
    }
}))
app.get("/",(req,res)=>{
    res.send("hallo word")
})


io.on('connection', (socket) => {
    console.log('New connection:', socket.id);
    socket.emit('welcome', 'Welcome to the chat');
  
    socket.on('joinRoom', (room) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    });
  
    socket.on('message', ({ message, room }) => {
      console.log('Message received:', message, 'in room:', room);
      io.to(room).emit('messageReceive', { message, room }); // Broadcast to the specific room
    });
  
    socket.on('disconnect', () => {
      console.log('Disconnected:', socket.id);
    });
  });

server.listen(port,()=>{
    console.log("server will be runing on port " , port)
})