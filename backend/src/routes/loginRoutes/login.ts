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
                    if (foundUser.isOnline === true) {
                        res.status(401).send({ message: 'user already logged in' })
                    } else {
                        const updatedFoundUser = {...foundUser, isOnline: foundUser.isOnline = true}
                        await User.findByIdAndUpdate({ _id: foundUser._id }, updatedFoundUser)
                        const jwtUserObj = {
                            id: foundUser._id,
                            name: foundUser.name,
                            email: userCredentials.email,
                        }
                        const token = jwt.sign(jwtUserObj, jwtToken)
                        res.send({ message: 'login successful', userCredentials, token })
                    }
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