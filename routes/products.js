const express = require('express')
const router = express.Router()
const product = require('../controllers/products')
const {isAuthenticated, authorizeRoles} = require('../middlewares/auth')

router.get('/', product.getProducts)
router.get('/:id', product.getSpecificProduct)
router.post('/new', isAuthenticated, authorizeRoles('admin'), product.createProduct)
router.put('/update/:id', isAuthenticated, authorizeRoles('admin'), product.updateProduct)
router.delete('/delete/:id', isAuthenticated, authorizeRoles('admin'), product.deleteProduct)

module.exports = router;