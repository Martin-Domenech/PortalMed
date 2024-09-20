import dotenv from 'dotenv'

dotenv.config()

export default{
    port: process.env.PORT,
    mongo_url: process.env.MONGO_URL,
    secret_key: process.env.SECRET_KEY,
    node_env: process.env.NODE_ENV
}