import express from 'express'
import bcrypt from 'bcrypt'
import { User } from '../../models/user'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const jwtToken = process.env.JSONTOKEN

const router = express.Router()

router.post('/', async (req, res) => {
    const userCredentials = req.body
    const foundUser = await User.findOne({ email: userCredentials.email })
    try {
        if (!foundUser) {
            res.status(404).send({ message: 'no user with that email found' })
        } else {
            const decodedPass = await bcrypt.compare(userCredentials.password, foundUser.password)
            if (!decodedPass) {
                res.status(401).send({ message: 'wrong password' })
            } else {
                if (jwtToken === undefined) {
                    throw new Error('no jwt secret found')
                } else {
                    const token = jwt.sign(userCredentials, jwtToken)
                    res.send({ message: 'login successful', userCredentials, token })
                }
            }
        }
    } catch (error) {
        console.log(error)
        if (error instanceof Error) {
            console.log(error)
            res.send(error.message)
        }
    }
})

export default router