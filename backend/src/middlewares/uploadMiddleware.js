import multer from 'multer'
import multerS3 from 'multer-s3'
import s3 from '../config/s3.js'

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname })
    },
    key: (req, file, cb) => {
      cb(null, `evos/${Date.now()}-${file.originalname}`)
    }
  })
})

export default upload