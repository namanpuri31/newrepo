const express=require('express')
const app=express()
const http=require('http')
const cors=require('cors')
const {Server}=require('socket.io')
const path=require('path')

const PORT=process.env.PORT||3001
app.use(cors())

const server=http.createServer(app)
console.log(path.join(__dirname,'../client/build'));
app.use(express.static(path.join(__dirname,'../client/build')))

app.get('/*',(_,res)=>{
    res.sendFile(path.join(__dirname,'../client/build/index.html'),(err)=>{
        res.status(500).send(err)
    })
})

const io=new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
})

io.on("connection",(socket)=>{
    console.log(`user with ID ${socket.id} joined`);
    socket.on('join_room',(data)=>{
        socket.join(data)
        console.log(`user of id ${socket.id} joined the room ${data}`);
    })
   
    socket.on('send_message',(data)=>{
        socket.to(data.room).emit('receive_message',data)
    })

    socket.on('disconnect',()=>{
        console.log(`User with ${socket.id} Disconnected!`);
    })
})


server.listen(PORT,()=>{
    console.log(`listening at port ${PORT}`);
})