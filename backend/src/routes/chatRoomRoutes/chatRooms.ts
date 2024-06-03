import express from 'express'
import { ChatRoom } from '../../models/chatRoom'

const router = express.Router()

router.get('/', async (req, res) => {
    const chats = await ChatRoom.find({}).populate('users')
    res.send(chats)
})

router.post('/', async (req, res) => {
    const chatObj = req.body
    await ChatRoom.create(chatObj)
    res.send({message: 'created', chatObj})
})

export default router