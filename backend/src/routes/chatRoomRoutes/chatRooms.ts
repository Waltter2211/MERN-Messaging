import express from 'express'
import { ChatRoom } from '../../models/chatRoom'
import { User } from '../../models/user'
import { jsonTokenVerifier } from '../../utils/jsonTokenVerifierMiddleware'

const router = express.Router()

router.get('/', async (req, res) => {
    const chats = await ChatRoom.find({}).populate('users')
    res.send(chats)
})

router.get('/:chatRoomId', async (req, res) => {
    try {
        const foundChatRoom = await ChatRoom.findById({ _id: req.params.chatRoomId }).populate('users')
        if (!foundChatRoom) {
            throw new Error('no chatrooms found with provided id')
        } else {
            res.send(foundChatRoom)
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log(error)
            res.send(error.message)
        }
    }
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
            throw new Error('user not found')
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log(error)
            res.send(error.message)
        }
    }
})

router.put('/:chatRoomId/:userId', jsonTokenVerifier, async (req, res) => {
    const validChatRoom = req.params.chatRoomId
    const validUser = req.params.userId

    try {
        const foundChatRoom = await ChatRoom.findOne({_id: validChatRoom})
        if (foundChatRoom === null) {
            throw new Error('no chatroom found')
        }
        else if (foundChatRoom) {
            const foundUser = await User.findOne({_id: validUser})
            if (foundUser === null) {
                throw new Error('no valid user found')
            }
            else if (foundChatRoom.users.includes(foundUser._id)) {
                const messageObj = {
                    sender: foundUser.name,
                    messageBody: req.body.messageBody,
                    timestamps: new Date()
                }
                foundChatRoom.messages.push(messageObj)
                await foundChatRoom.save()
                res.send({message: 'message sent successfully', content: messageObj})
            } else {
                throw new Error('user not authorized to send messages')
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log(error)
            res.send(error.message)
        }
    }
})

export default router