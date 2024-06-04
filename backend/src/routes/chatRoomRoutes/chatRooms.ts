import express from 'express'
import { ChatRoom } from '../../models/chatRoom'
import { User } from '../../models/user'

const router = express.Router()

router.get('/', async (req, res) => {
    const chats = await ChatRoom.find({}).populate('users')
    res.send(chats)
})

router.post('/', async (req, res) => {
    const chatObj = req.body
    
    try {
        const user1Obj = await User.findById({_id: chatObj.users[0]})
        const user2Obj = await User.findById({_id: chatObj.users[1]})
        if (user1Obj && user2Obj) {
            await ChatRoom.create(chatObj)
            const newChat = await ChatRoom.findOne({ users: [chatObj.users[0], chatObj.users[1]] })
            if (newChat === null) {
                throw new Error('some error with creating chat happened')
            } else {
                const updatedUser1Obj = {...user1Obj, chatRooms: user1Obj.chatRooms.push(newChat._id)}
                const updatedUser2Obj = {...user2Obj, chatRooms: user2Obj.chatRooms.push(newChat._id)}
                await User.findByIdAndUpdate({ _id: chatObj.users[0] }, updatedUser1Obj)
                await User.findByIdAndUpdate({ _id: chatObj.users[1] }, updatedUser2Obj)
                res.send({user1: user1Obj, user2: user2Obj})
            }
        } else {
            console.log('user not found')
        }
    } catch (error) {
        console.log(error)
        res.send('server error')
    }
})

export default router