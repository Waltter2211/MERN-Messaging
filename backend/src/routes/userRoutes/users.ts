import express from 'express'
import bcrypt from 'bcrypt'
import { User } from '../../models/user'

const router = express.Router()

router.get('/', async (req, res) => {
    const users = await User.find({})
    res.send(users)
})

router.post('/', async (req, res) => {
    const userObj = req.body
    try {
        const hashedPass = await bcrypt.hash(userObj.password, 10)
        userObj.password = hashedPass
        await User.create(userObj)
        res.send({message: 'created', userObj})
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})

export default router