import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { User } from '../../models/user'
import { jsonTokenDecoder } from '../../utils/jsonTokenVerifierMiddleware'

export const findUsers = async (_req:Request, res:Response) => {
    const users = await User.find({})
    res.send(users)
}

export const findUser = async (req:Request, res:Response) => {
    const token = req.headers.authorization
    try {
        if (!token) {
            res.status(404).send({ message: 'No authorization token found' })
        } else {
            const decodedToken = jsonTokenDecoder(token)
            if (req.params.userEmail !== decodedToken.email) {
                res.status(401).send({ message: 'No email matches this session' })
            } else {
                const foundUser = await User.findById({ _id: decodedToken.id }).populate('chatRooms')
                if (!foundUser) {
                    res.status(404).send({ message: 'No user found' })
                } else {
                    res.send({message: 'User found', user: foundUser})
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
    
}

export const createUser = async (req:Request, res:Response) => {
    const userObj = req.body
    try {
        const foundUserName = await User.findOne({ name: userObj.name })
        const foundUserEmail = await User.findOne({ email: userObj.email })
        if (foundUserName || foundUserEmail) {
            res.status(401).send({ message: 'User with that name or email has already been registered' })
        } else {
            const hashedPass = await bcrypt.hash(userObj.password, 10)
            userObj.password = hashedPass
            await User.create(userObj)
            res.send({ message: 'User successfully created', userObj })
        }
    } catch (error) {
        if (error instanceof Error) {
            /* console.log(error) */
            res.status(401).send({error: error.message})
        }
    }
}

export const logout = async (req:Request, res:Response) => {
    const token = req.headers.authorization
    try {
        if (!token) {
            res.status(404).send({ message: 'No token found' })
        } else {
            const decodedToken = jsonTokenDecoder(token)
            if (req.params.userEmail !== decodedToken.email) {
                res.status(401).send({ message: 'No valid session token found' })
            } else {
                const foundUser = await User.findById({ _id: decodedToken.id })
                if (!foundUser) {
                    res.status(404).send({ message: 'User not found' })
                } else {
                    const updatedFoundUserObj = {...foundUser, isOnline: foundUser.isOnline = false}
                    await User.findByIdAndUpdate({ _id: foundUser._id }, updatedFoundUserObj)
                    res.send({ message: 'Successfully logged out' })
                }
            }
        }
    } catch (error) {
        /* console.log(error) */
    }
}



