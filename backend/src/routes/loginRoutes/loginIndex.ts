import express from 'express'
import { login } from './login'

const router = express.Router()

router.post('/', login)

export default router