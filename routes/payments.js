const express = require('express')
const router = express.Router()
const payment = require('../controllers/payment')
const {isAuthenticated, authorizeRoles} = require('../middlewares/auth')

router.post('/process', payment.processPayment)
router.get('/stripeapi', payment.sendStripeApi)

module.exports = router