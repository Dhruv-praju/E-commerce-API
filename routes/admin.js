const express = require('express')
const router = express.Router()
const admin = require('../controllers/admin')
const { isAuthenticated, authorizeRoles } = require('../middlewares/auth')

router.get('/users',  admin.getAllUsers)
router.get('/users/:id', admin.getUserById)
// router.put('/users/:id', )
// router.delete('/users/:id', )

module.exports = router