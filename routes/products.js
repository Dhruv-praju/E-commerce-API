const express = require('express')
const router = express.Router()
const multer = require('multer')
const {storage} = require('../utils/cloudinaryConfig')
const upload = multer({storage})

const product = require('../controllers/products')
const {isAuthenticated, authorizeRoles} = require('../middlewares/auth')

router.get('/', product.getProducts)
router.get('/:id', product.getSpecificProduct)
router.post('/new', isAuthenticated, authorizeRoles('admin'), upload.single('image'), product.createProduct)
router.put('/update/:id', isAuthenticated, authorizeRoles('admin'), upload.single('image'), product.updateProduct)
router.delete('/delete/:id', isAuthenticated, authorizeRoles('admin'), product.deleteProduct)

router.get('/:id/reviews', isAuthenticated, product.getProductReviews)
router.post('/:id/reviews/new', isAuthenticated, product.createProductReview)
router.delete('/:prodId/reviews/:id/delete', isAuthenticated, product.deleteReview)

module.exports = router;