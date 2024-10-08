import mongoose from 'mongoose'

interface ChatRoomInterface {
    users:mongoose.Types.ObjectId[]
    messages:MessageBody[]
}

interface MessageBody {
    sender:string
    messageBody:string
    timestamps:string
}

const chatRoomSchema = new mongoose.Schema<ChatRoomInterface>({
    users: {
        type: [{type: mongoose.Types.ObjectId, ref: 'users'}]
    },
    messages: {
        type: [{type: mongoose.Types.ObjectId, ref: 'messages'}]
        /* type: [{type: Object}] */
    }
}, { timestamps:true })

export const ChatRoom = mongoose.model('chatRooms', chatRoomSchema)