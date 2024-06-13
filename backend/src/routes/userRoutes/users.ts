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
        const foundUser = await User.findOne({ name: userObj.name })
        if (foundUser) {
            res.status(401).send({ message: 'user with that name has already been registered' })
        } else {
            const hashedPass = await bcrypt.hash(userObj.password, 10)
            userObj.password = hashedPass
            await User.create(userObj)
            res.send({message: 'user successfully created', userObj})
        }
    } catch (error) {
        if (error instanceof Error) {
            console.log(error)
            res.status(401).send({error: error.message})
        }
    }
})

export default router