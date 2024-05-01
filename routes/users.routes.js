const router = require('express').Router()
const passport = require('../libs/passport')

const { image } = require('../libs/multer')
const { register, googleOauth2, updateProfile, updateAvatar } = require('../controllers/users.controller')

//Register - Custom
router.post('/auth/register', register)
//Register - Oauth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/api/v1/google',
        session: false
    }),
    googleOauth2
);

//Update
router.put('/users/:id/update', updateProfile)
router.put('/users/:id/avatar', image.single('image'), updateAvatar)

module.exports = router