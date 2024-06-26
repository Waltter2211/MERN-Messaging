import express from 'express'
import { login, verifySession } from './login'
import { jsonTokenVerifier } from '../../utils/jsonTokenVerifierMiddleware'

const router = express.Router()

router.post('/', login)
router.get('/', jsonTokenVerifier, verifySession)

export default router