import bcrypt from 'bcrypt'
import passport from 'passport';

// Hashear la password
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

//Validar password
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)


export const authorization = (roles) => {
    return async (req, res, next) => {
        if(!req.user){
            console.error('No hay usuario en la solicitud');
            return res.status(401).send({ error: "Unauthorized"})
        }
        if(!roles.includes(req.user.role)){
            console.error('Acceso denegado: rol no permitido');
            return res.status(403).send({ error: "No permission "})
        }
        next()
    }
}

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if (err) {
                console.error('Error en la autenticación:', err);
                return next(err)
            }
            if (!user) {
                console.error('Usuario no encontrado:', info);
                return res.status(401).send({ error: info.messages ? info.messages : info.toString() })
            }

            req.user = user
            next()
        })(req, res, next)
    }
}