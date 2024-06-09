import jwt from 'jsonwebtoken'
import 'dotenv/config'

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
            console.log(error)
            res.send(error)
        }
    }
}