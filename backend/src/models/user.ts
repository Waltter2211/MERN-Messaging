import mongoose from 'mongoose'

interface UserInterface {
    name:string
    password:string
    chatRooms:mongoose.Types.ObjectId[]
}

const userSchema = new mongoose.Schema<UserInterface>({
    name: {
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