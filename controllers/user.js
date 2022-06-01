const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

// Get users   =>   /api/users
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

// Get user by id   =>   /api/users/:id
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

// Update user by id    =>  /api/users/update/:id
module.exports.updateUser = catchAsync(
    async(req, res) => {
        const {id} = req.params
        const {firstName, lastName, email, role} = req.body
        const user = await User.findByIdAndUpdate(id, {name:`${firstName} ${lastName}`, email, role}, {runValidators:true, new:true})

        if(!user) throw new ExpressError(404, `User does not found of id ${id}`)

        res.status(200).json({
            success: true,
            user
        })
    }
)

// Delete user    =>   /api/users/delete/:id
module.exports.deleteUser = catchAsync(
    async(req, res) => {
        const {id} = req.params
        const user = await User.findByIdAndDelete(id)

        if(!user) throw new ExpressError(404, `User does not found of id ${id}`)

        res.status(200).json({
            success:true,
            message:'User deleted Successfully',
            user
        })
    }
)