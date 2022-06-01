const express = require('express')
const router = express.Router()
const user = require('../controllers/user')
const { isAuthenticated, authorizeRoles } = require('../middlewares/auth')

router.get('/', isAuthenticated, authorizeRoles('admin'),  user.getAllUsers)
router.get('/:id', isAuthenticated, authorizeRoles('admin'), user.getUserById)
router.delete('/delete/:id', isAuthenticated, authorizeRoles('admin'), user.deleteUser)
router.put('/update/:id', isAuthenticated, authorizeRoles('admin'), user.updateUser)

module.exports = router