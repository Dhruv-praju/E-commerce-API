const express = require('express')
const router = express.Router()

const auth = require('../controllers/auth')
const { isAuthenticated } = require('../middlewares/auth')

router.get('/me', isAuthenticated, auth.getUserProfile)
router.put('/me/update', isAuthenticated, auth.updateUserProfile)

router.post('/login', auth.logIn)
router.post('/signup', auth.signUp)
router.get('/logout', auth.logOut)
router.post('/password/forgot', auth.forgotPassword)
router.post('/password/reset/:token', auth.resetPassword)

module.exports = router