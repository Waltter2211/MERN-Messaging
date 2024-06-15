import express from 'express'
import bcrypt from 'bcrypt'
import { User } from '../../models/user'
import { jsonTokenDecoder, jsonTokenVerifier } from '../../utils/jsonTokenVerifierMiddleware'

const router = express.Router()

router.get('/', async (req, res) => {
    const users = await User.find({})
    res.send(users)
})

router.get('/:userEmail', jsonTokenVerifier, async (req, res) => {
    const token = req.headers.authorization
    if (token) {
        const decodedToken = jsonTokenDecoder(token)
        if (req.params.userEmail === decodedToken.email) {
            const foundUser = await User.findById({ _id: decodedToken.id }).populate('chatRooms')
            if (foundUser) {
                res.send(foundUser)
            } else {
                res.status(404).send({message: 'no user found'})
            }
        } else {
            res.status(401).send({message: 'no email matches this session'})
        }
    } else {
        res.status(404).send({message: 'no authorization token found'})
    }
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