const express = require('express')
const router = express.Router()
const order = require('../controllers/order')
const {isAuthenticated, authorizeRoles} = require('../middlewares/auth')

router.post('/new', isAuthenticated, order.makeOrder)
router.get('/me', isAuthenticated, order.getMyOrders)
router.get('/all', isAuthenticated, authorizeRoles('admin'), order.getAllOrders)
router.put('/:id', isAuthenticated, authorizeRoles('admin'), order.updateOrder)
router.get('/:id', isAuthenticated, order.getOrderById)
router.delete('/delete/:id', isAuthenticated, authorizeRoles('admin'), order.deleteOrder)

module.exports = router