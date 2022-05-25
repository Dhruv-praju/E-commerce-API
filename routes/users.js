const express = require('express')
const router = express.Router()

const user = require('../controllers/users')

router.post('/login', user.logIn)
router.post('/signup', user.signUp)

module.exports = router