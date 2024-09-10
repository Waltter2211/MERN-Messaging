import mongoose from 'mongoose'
import app from './app'
import 'dotenv/config'
import { Server } from 'socket.io'
import { instrument } from '@socket.io/admin-ui'
import { createServer } from 'http'

const PORT = 3000;

const httpServer = createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:5000', 'https://admin.socket.io'],
        credentials: true
    },
})

instrument(io, {
    auth: false,
    mode: 'development'
})

io.on('connection', (socket) => {

    socket.on('join room', (roomId:string) => {
        socket.join(roomId)
    })

    socket.on('message', (roomId:string) => {
        io.to(roomId).emit('ping refetch')
        console.log('received in backend')
    })
})

httpServer.listen(PORT, () => {
    console.log('connected to server')
    mongoose.connect(process.env.MONGO_URL as string)
    .then(() => {
        console.log('connected to database')
    })
    .catch((err) => console.log(err))
})

export default io