import express from 'express'
import { jsonTokenVerifier } from '../../utils/jsonTokenVerifierMiddleware'
import { createUser, findUser, findUsers, logout } from './users'

const router = express.Router()

router.get('/', findUsers)
router.get('/:userEmail', jsonTokenVerifier, findUser)
router.post('/', createUser)
router.put('/:userEmail', jsonTokenVerifier, logout)

export default router