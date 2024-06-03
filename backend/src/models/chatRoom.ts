import mongoose from 'mongoose'

interface ChatRoomInterface {
    users:mongoose.Types.ObjectId[]
}

const chatRoomSchema = new mongoose.Schema<ChatRoomInterface>({
    users: {
        type: [{type: mongoose.Types.ObjectId, ref: 'users'}]
    }
})

export const ChatRoom = mongoose.model('chatRooms', chatRoomSchema)