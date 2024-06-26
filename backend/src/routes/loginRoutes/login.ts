import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { User } from '../../models/user'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { jwtDecode } from 'jwt-decode'

const jwtToken = process.env.JSONTOKEN

export const login = async (req:Request, res:Response) => {
    const userCredentials = req.body
    const foundUser = await User.findOne({ email: userCredentials.email })
    try {
        if (!foundUser) {
            res.status(404).send({ message: 'No user with that email found' })
        } else {
            const decodedPass = await bcrypt.compare(userCredentials.password, foundUser.password)
            if (!decodedPass) {
                res.status(401).send({ message: 'Wrong password' })
            } else {
                if (jwtToken === undefined) {
                    throw new Error('No jwt secret found')
                } else {
                    if (foundUser.isOnline === true) {
                        res.status(401).send({ message: 'User already logged in' })
                    } else {
                        const updatedFoundUser = {...foundUser, isOnline: foundUser.isOnline = true}
                        await User.findByIdAndUpdate({ _id: foundUser._id }, updatedFoundUser)
                        const jwtUserObj = {
                            id: foundUser._id,
                            name: foundUser.name,
                            email: userCredentials.email,
                        }
                        const token = jwt.sign(jwtUserObj, jwtToken)
                        res.send({ message: 'Login successful', userCredentials, token })
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
}

export const verifySession = async (req:Request, res:Response) => {
    const token = req.headers.authorization

    if (token) {
        const decodedToken = jwtDecode(token)
        res.send(decodedToken)
    } else {
        res.status(404).send({ message: 'Token not found' })
    }

}