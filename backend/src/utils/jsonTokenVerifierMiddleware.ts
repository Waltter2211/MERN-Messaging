import jwt, { JwtPayload } from 'jsonwebtoken'
import 'dotenv/config'
import { jwtDecode } from 'jwt-decode'
import { Request, Response, NextFunction } from 'express'

const jwtSecret = process.env.JSONTOKEN

export const jsonTokenVerifier = (req:Request, res:Response, next:NextFunction) => {
    
    if (jwtSecret === undefined) {
        res.send('No jwt secret key found')
    } else {
        try {
            if (!req.headers.authorization) {
                res.status(404).send({ message: 'No authorization token found' })
            } else {
                const token = req.headers.authorization.substring(7)
                const verified = jwt.verify(token, jwtSecret)
                if (verified) {
                    next()
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log(error)
                res.send(error.message)
            }
        }
    }
}

export const jsonTokenDecoder = (token:string) => {
    const decoded = jwtDecode<JwtPayload>(token)
    return decoded
}