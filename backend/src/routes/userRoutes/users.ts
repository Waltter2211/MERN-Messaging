import express from 'express'
import { User } from '../../models/user'

const router = express.Router()

router.get('/', async (req, res) => {
    const users = await User.find({})
    res.send(users)
})

router.post('/', async (req, res) => {
    const userObj = req.body
    await User.create(userObj)
    res.send({message: 'created', userObj})
})

export default router