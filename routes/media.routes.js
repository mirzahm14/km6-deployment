const router = require('express').Router()
const { imageStorage, videoStorage, documentStorage, image, video, document } = require('../libs/multer')
const { singleUpload, multiUpload, imagekit, generateQrCode } = require('../controllers/media.controllers')

//LOCAL - SINGLE UPLOAD
router.post('/storage/images', imageStorage.single('image'), singleUpload)
router.post('/storage/videos', videoStorage.single('video'), singleUpload)
router.post('/storage/documents', documentStorage.single('document'), singleUpload)

//LOCAL - MULTI UPLOAD
router.post('/storage/multi/images', imageStorage.array('image'), multiUpload)
router.post('/storage/multi/videos', videoStorage.array('video'), multiUpload)
router.post('/storage/multi/documents', documentStorage.array('document'), multiUpload)

//IMAGEKIT
router.post('/imagekit/images', image.single('image'), imagekit)
router.post('/imagekit/videos', video.single('video'), imagekit)
router.post('/imagekit/documents', document.single('document'), imagekit)
router.post('/imagekit/qr-codes', generateQrCode)

module.exports = router