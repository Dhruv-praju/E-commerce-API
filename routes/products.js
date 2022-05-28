const express = require('express')
const router = express.Router()
const product = require('../controllers/products')
const {isAuthenticated, authorizeRoles} = require('../middlewares/auth')

router.get('/', isAuthenticated, authorizeRoles('admin'), product.getProducts)
router.get('/:id', product.getSpecificProduct)
router.post('/', product.createProduct)
router.put('/:id',  product.updateProduct)
router.delete('/:id', product.deleteProduct)

module.exports = router;