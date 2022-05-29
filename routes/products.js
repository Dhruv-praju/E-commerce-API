const express = require('express')
const router = express.Router()
const product = require('../controllers/products')
const {isAuthenticated, authorizeRoles} = require('../middlewares/auth')

router.get('/', isAuthenticated, authorizeRoles('admin'), product.getProducts)
router.get('/:id', product.getSpecificProduct)
router.post('/', isAuthenticated, authorizeRoles('admin'), product.createProduct)
router.put('/:id', isAuthenticated, authorizeRoles('admin'), product.updateProduct)
router.delete('/:id', isAuthenticated, authorizeRoles('admin'), product.deleteProduct)

module.exports = router;