const jwt = require('jsonwebtoken');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require("../utils/ExpressError");

// Checks if user is authenticated or not
const isAuthenticated = catchAsync(
    async (req, res, next) => {
        const { token } = req.session
    
        if(!token) throw(new ExpressError(401, 'User is not authenticated'))
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id)
        next()
    }
)

// Sets or Gives permission to specified roles only
const authorizeRoles = (...roles) => {
    return catchAsync(
        async(req, res, next) => {
            if(!roles.includes(req.user.role))
            throw(new ExpressError(403, `Role '${req.user.role}' is not allowed to access this resource.`))

            next()
        }
    )
}
module.exports = {isAuthenticated, authorizeRoles}