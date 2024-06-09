import mongoose from 'mongoose'

interface MessageInterface {
    sender:string
    messageBody:string
}

const messageSchema = new mongoose.Schema<MessageInterface>({
    sender: {
        type: String,
        required: true
    },
    messageBody: {
        type: String,
        required: true
    }
}, {timestamps: true})

export const Message = mongoose.model('messages', messageSchema)