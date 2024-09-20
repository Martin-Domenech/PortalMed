import passport from "passport";
import jwt from 'passport-jwt'
import config from './config.js'

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const cookieExtractor = (req) => {
    let token = null
    if(req && req.cookies ){
        token = req.cookies['authToken']
    }
    return token
}

const initializePassport = () => {

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest:ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: config.secret_key
    },async(jwt_payload, done) => {
        try{
            return done(null, jwt_payload)
        }catch (error){
            done(error)
        }
    }))
}

export default initializePassport