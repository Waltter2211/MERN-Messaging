import mongoose from 'mongoose'

interface MessageInterface {
    sender:string
    messageBody:string
    timestamps:string
}

const messageSchema = new mongoose.Schema<MessageInterface>({
    sender: {
        type: String,
        required: true
    },
    messageBody: {
        type: String,
        required: true
    },
    timestamps: {
        type: String,
        required: true
    }
}, /* {timestamps: true} */)

export const Message = mongoose.model('messages', messageSchema)