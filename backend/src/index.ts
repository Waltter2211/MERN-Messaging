import express from 'express'
import mongoose from 'mongoose'
import usersRouter from './routes/userRoutes/users'
import chatRoomsRouter from './routes/chatRoomRoutes/chatRooms'

const app = express();

const PORT:any = 3000;
const MONGOURI = 'mongodb://localhost:27017/messaging-app'

app.use(express.json())
app.use('/api/users', usersRouter)
app.use('/api/chatRooms', chatRoomsRouter)

mongoose.connect(MONGOURI).then(() => console.log('connected to database'))

app.listen(PORT, () => console.log('connected to server'))