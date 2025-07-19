import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from './config/database.js'
import cookieParser from 'cookie-parser'
import sessionsRouter from './api/sessions.js'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import config from './config/config.js'
import patientsRouter from './api/patients.js'
import evosRouter from './api/evos.js'
import turnosRouter from './api/turnos.js'

const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:5173',
  'https://portalmedapp.com', 
  'https://www.portalmedapp.com',
  'https://api.portalmedapp.com',
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Origen no permitido por CORS'))
    }
  },
  credentials: true
}))

app.set('views', './src/views');

app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())
initializePassport()
app.use(passport.initialize())

app.use('/api/sessions', sessionsRouter)
app.use('/api/patients', patientsRouter)
app.use('/api/evos', evosRouter)
app.use('/api/turnos', turnosRouter)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});