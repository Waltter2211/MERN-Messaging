import mongoose from 'mongoose'

interface UserInterface {
    name:string
    email:string
    password:string
    chatRooms:mongoose.Types.ObjectId[]
}

const userSchema = new mongoose.Schema<UserInterface>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    chatRooms: {
        type: [{type: mongoose.Types.ObjectId, ref: 'chatRooms'}]
    }
})

export const User = mongoose.model('users', userSchema)