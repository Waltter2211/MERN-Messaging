import express from 'express'
import mongoose from 'mongoose'
import usersRouter from './routes/userRoutes/users'
import chatRoomsRouter from './routes/chatRoomRoutes/chatRooms'
import loginRouter from './routes/login/login'

const app = express();

const PORT = 3000;
const MONGOURI = 'mongodb://localhost:27017/messaging-app'

app.use(express.json())
app.use('/api/users', usersRouter)
app.use('/api/chatRooms', chatRoomsRouter)
app.use('/api/login', loginRouter)

mongoose.connect(MONGOURI).then(() => console.log('connected to database'))

app.listen(PORT, () => console.log('connected to server'))