import mongoose from 'mongoose'

interface ChatRoomInterface {
    users:mongoose.Types.ObjectId[]
    messages:string[]
}

const chatRoomSchema = new mongoose.Schema<ChatRoomInterface>({
    users: {
        type: [{type: mongoose.Types.ObjectId, ref: 'users'}]
    },
    messages: {
        type: [{type: String}]
    }
})

export const ChatRoom = mongoose.model('chatRooms', chatRoomSchema)