const express = require('express')
const router = express.Router()

const user = require('../controllers/users')
const { isAuthenticated } = require('../middlewares/auth')

router.get('/me', isAuthenticated, user.getUserProfile)
router.post('/login', user.logIn)
router.post('/signup', user.signUp)
router.get('/logout', user.logOut)
router.post('/password/forgot', user.forgotPassword)
router.post('/password/reset/:token', user.resetPassword)

module.exports = router