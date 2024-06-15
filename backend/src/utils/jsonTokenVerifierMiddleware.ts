import jwt, { JwtPayload } from 'jsonwebtoken'
import 'dotenv/config'
import { jwtDecode } from 'jwt-decode'

const jwtSecret = process.env.JSONTOKEN

export const jsonTokenVerifier = (req, res, next) => {
    
    if (jwtSecret === undefined) {
        res.send('no jwt secret key found')
    } else {
        try {
            const token = req.headers.authorization.substring(7)
            const verified = jwt.verify(token, jwtSecret)
            if (verified) {
                next()
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