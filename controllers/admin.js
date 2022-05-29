const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')

// Get users => /admin/users
module.exports.getAllUsers = catchAsync(
    async(req, res) => {
        const total = await User.countDocuments()
        const users = await User.find({})

        res.status(200).json({ 
            success:true, 
            total, 
            users 
        })
    }
)

// Get user by id => /admin/users/:id
module.exports.getUserById = catchAsync(
    async(req, res) => {
        const {id} = req.params
        const user = await User.findById(id)

        res.status(200).json({
            success:true,
            user
        })
    }
)