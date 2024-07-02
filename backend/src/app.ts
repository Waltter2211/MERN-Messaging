import express from 'express'
import cors from 'cors'
import usersRouter from './routes/userRoutes/usersIndex'
import chatRoomsRouter from './routes/chatRoomRoutes/chatRoomIndex'
import loginRouter from './routes/loginRoutes/loginIndex'
import 'dotenv/config'

const app = express();
/* const MONGOURI = 'mongodb://mongo-cont:27017/messaging-app-prod' */

app.use(express.json())
app.use(cors())
app.use('/api/users', usersRouter)
app.use('/api/chatRooms', chatRoomsRouter)
app.use('/api/login', loginRouter)

export default app