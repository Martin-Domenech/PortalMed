import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';
import mongoose from './config/database.js';
import cookieParser from 'cookie-parser';
import sessionsRouter from './api/sessions.js'
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import config from './config/config.js'

const app = express();

const PORT = config.port

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:5173', // Permitir solicitudes solo desde este origen
    credentials: true,
}));

app.set('views', './src/views');

app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())
initializePassport()
app.use(passport.initialize())

app.use('/api/sessions', sessionsRouter)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});