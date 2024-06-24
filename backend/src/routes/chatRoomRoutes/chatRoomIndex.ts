import express from 'express'
import { createNewChatRoom, findChatRoom, findChatRooms, sendMessageToChatRoom } from './chatRooms'
import { jsonTokenVerifier } from '../../utils/jsonTokenVerifierMiddleware'

const router = express.Router()

router.get('/', findChatRooms)
router.get('/:chatRoomId', findChatRoom)
router.post('/:userEmail', jsonTokenVerifier, createNewChatRoom)
router.put('/:chatRoomId/:userId', jsonTokenVerifier, sendMessageToChatRoom)

export default router