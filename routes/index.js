const router = require('express').Router()
const qr = require('node-qr-image')

const mediaRouter = require('./media.routes')
const userRouter = require('./users.routes')

router.use('/media', mediaRouter)
router.use('/', userRouter)
router.get('/qr', (req, res) => {
    let time = new Date(Date.now())
    let qr_svg = qr.image(`TESTING BRO - ${time.toDateString()}`, {type:'png'})
    qr_svg.pipe(require('fs').createWriteStream(`public/qr/qr-${Date.now()}.png`))

    res.send('QR CREATED CHECK YOUR PUBLIC FOLDER!')
})

router.get('/', (req, res) => {
    res.status(200).json({
        status: true,
        message: "Successfully connected to server, Enjoy!",
        error: null,
        data: null
    })
})



module.exports = router