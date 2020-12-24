const express= require('express')
const app= express()
const server= require('http').Server(app)
var PORT= process.env.PORT || 443
const io= require('socket.io')(server)
const  { v4 : uuidV4 }= require('uuid')
const { ExpressPeerServer} = require('peer')
const peerServer= ExpressPeerServer(server,{
    debug:true
})
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use('/peerjs',peerServer)

app.get('/',(req,res)=>{
    res.redirect(`/${uuidV4()}`)
})
app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room})
})

io.on('connection', socket=>{
    socket.on('join-room', (roomId,userId)=>{
        socket.join(roomId)
        console.log()
        socket.to(roomId).broadcast.emit('user-connected',userId)
      
    })
})
server.listen(PORT)

