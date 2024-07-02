import mongoose from 'mongoose'
import app from './app'
import 'dotenv/config'

const PORT = 3000;

app.listen(PORT, () => {
    console.log('connected to server')
    mongoose.connect(process.env.MONGO_URL as string)
    .then(() => {
        console.log('connected to database')
    })
    .catch((err) => console.log(err))
})
/* mongoose.connect(process.env.MONGO_URL as string)
.then(() => {
    console.log('connected to database')
})
.catch((err) => console.log(err)) */