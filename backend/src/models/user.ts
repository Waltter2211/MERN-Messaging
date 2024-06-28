import mongoose from 'mongoose'

interface UserInterface {
    name:string
    email:string
    password:string
    chatRooms:mongoose.Types.ObjectId[]
    isOnline:boolean
}

const userSchema = new mongoose.Schema<UserInterface>({
    name: {
        type: String,
        required: true,
        minLength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: 5
    },
    password: {
        type: String,
        required: true,
        minLength: 3
    },
    chatRooms: {
        type: [{type: mongoose.Types.ObjectId, ref: 'chatRooms'}]
    },
    isOnline: {
        type: Boolean,
        required: true,
        default: false
    }
})

export const User = mongoose.model('users', userSchema)