import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import usersRouter from './routes/userRoutes/usersIndex'
import chatRoomsRouter from './routes/chatRoomRoutes/chatRoomIndex'
import loginRouter from './routes/loginRoutes/loginIndex'
import 'dotenv/config'

const app = express();
const PORT = 3000;
/* const MONGOURI = 'mongodb://mongo-cont:27017/messaging-app-prod' */

app.use(express.json())
app.use(cors())
app.use('/api/users', usersRouter)
app.use('/api/chatRooms', chatRoomsRouter)
app.use('/api/login', loginRouter)

mongoose.connect(process.env.MONGO_URL as string)
.then(() => console.log('connected to database'))
.catch((err) => console.log(err))

app.listen(PORT, () => console.log('connected to server'))

export default app