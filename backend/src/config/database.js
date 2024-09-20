import mongoose from 'mongoose';
import config from './config.js'

mongoose.connect(config.mongo_url)


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

export default db;
