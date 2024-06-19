import express from 'express'
import { ChatRoom } from '../../models/chatRoom'
import { User } from '../../models/user'
import { jsonTokenVerifier, jsonTokenDecoder } from '../../utils/jsonTokenVerifierMiddleware'

const router = express.Router()

router.get('/', async (req, res) => {
    const chats = await ChatRoom.find({}).populate('users')
    res.send(chats)
})

router.get('/:chatRoomId', async (req, res) => {
    try {
        const foundChatRoom = await ChatRoom.findById({ _id: req.params.chatRoomId }).populate('users')
        if (!foundChatRoom) {
            res.status(404).send({message: 'no chatrooms found with provided id'})
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

router.post('/:userEmail', jsonTokenVerifier, async (req, res) => {
    const token = req.headers.authorization
    try {
        if (token) {
            const decodedToken = jsonTokenDecoder(token)
            if (req.params.userEmail === decodedToken.email) {
                const user1Obj = await User.findOne({ email: req.params.userEmail })
                const user2Obj = await User.findOne({ email: req.body.user })
                if (user1Obj && user2Obj) {
                    if (user1Obj.email === user2Obj.email) {
                        res.status(401).send({ message: 'cannot create room with yourself' })
                    } else {
                        const chatObj = {
                            users: [user1Obj._id, user2Obj._id]
                        }
                        const foundRoom = await ChatRoom.findOne({ $or: [ { users: [chatObj.users[0], chatObj.users[1] ] }, { users: [chatObj.users[1], chatObj.users[0] ] } ] })
                        if (foundRoom) {
                            res.status(401).send({ message: 'room already exists' })
                        } else {
                            await ChatRoom.create(chatObj)
                            const newChat = await ChatRoom.findOne({ users: [chatObj.users[0], chatObj.users[1]] })
                            if (newChat === null) {
                                throw new Error('some error with creating chat happened')
                            } else {
                                const updatedUser1Obj = {...user1Obj, chatRooms: user1Obj.chatRooms.push(newChat._id)}
                                const updatedUser2Obj = {...user2Obj, chatRooms: user2Obj.chatRooms.push(newChat._id)}
                                await User.findByIdAndUpdate({ _id: chatObj.users[0] }, updatedUser1Obj)
                                await User.findByIdAndUpdate({ _id: chatObj.users[1] }, updatedUser2Obj)
                                res.send({message: 'successfully added user to contacts'})
                            } 
                        }
                    }
                } else {
                    res.status(404).send({ message: 'user not found' })
                }
            } else {
                res.status(401).send({message: 'no user matches this session'})
            }
        } else {
            res.status(404).send({message: 'no authorization token found'})
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
    const token = req.headers.authorization
    
    try {
        if (token) {
            const decodedToken = jsonTokenDecoder(token)
            if (req.params.userId === decodedToken.id) {
                const foundChatRoom = await ChatRoom.findOne({_id: validChatRoom})
                if (foundChatRoom === null) {
                    res.status(404).send('no chatroom found')
                }
                else if (foundChatRoom) {
                    const foundUser = await User.findOne({_id: validUser})
                    if (foundUser === null) {
                        res.status(404).send('no valid user found')
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
                        res.status(401).send({message: 'user not authorized to send messages'})
                    }
                }
            } else {
                res.status(401).send({message: 'no user matches this session'})
            }
        } else {
            res.status(404).send({message: 'no authorization token found'})
        }
        
    } catch (error) {
        if (error instanceof Error) {
            console.log(error)
            res.send(error.message)
        }
    }
})

export default router