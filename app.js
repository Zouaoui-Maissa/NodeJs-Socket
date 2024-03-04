const express=require("express")
const http=require("http")
const bodyparser=require("body-parser")
const mongo = require("mongoose")
const config=require('./config/dbconnection.json')
mongo.connect(config.url,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>console.log("database connected")).catch(()=>console.log("not connected"))
const userRouter=require("./routes/users")
const classroomRouter=require("./routes/classroom")
const {join} = require("path");
const {addMessage} = require("./controller/messageController");
var app=express()

app.use(bodyparser.json())
app.set("views",join(__dirname,"views"))
app.set("view engine","twig")
app.use("/users", userRouter);
app.use("/classroom", classroomRouter);

const server=http.createServer(app)
const io = require("socket.io")(server)


io.on("connection",(socket)=>{
    socket.emit("message","user is connected")
    socket.on("message",(data)=>{
        addMessage(data).then(r => console.log("message added"+r))
        io.emit("message",data)
    })
    socket.on("typing",(data)=>{
        socket.broadcast.emit("typing...",data)
    })
    socket.on("disconnect",()=>{
        io.emit("message","user is disconnected")
    }) 
})
server.listen(4000, () => {
    console.log('App is running on port 3005');
  });

module.exports=app