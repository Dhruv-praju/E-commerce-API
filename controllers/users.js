const crypto = require('crypto')

const User = require("../models/user")
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")
const sendEmail = require('../utils/sendEmail')

// Login user => /api/login
module.exports.logIn = catchAsync(
    async (req, res) => {
        const {email, password} = req.body
            // find user with given email
            const existingUser = await User.findOne({ email })
    
            if(!existingUser) return res.status(404).json({ message:"User doesn't exist" })
            else {
                // check for the password
                const isPasswordCorrect = await existingUser.comparePassword(password)
        
                if(!isPasswordCorrect) res.status(400).json({ message:'Invalid Credentials.' })
                else{
                    // generate token by signing with email
                    const token = existingUser.getJwtToken()
                    // options for cookie
                    const options = {
                        expires: new Date(
                            Date.now() + process.env.COOKIE_EXPIRES_TIME * 1000 * 60 * 60 * 24
                        ),
                        httpOnly: true
                    }
                    res.status(200).cookie('token', token, options).json({ 
                        success:true, 
                        user:existingUser, 
                        token 
                    })
                }
            }
    }

)

// Sign Up user => /api/signup
module.exports.signUp = catchAsync(
    async (req, res) => {
       const {email, password, firstName, lastName, role='user'} = req.body
   
           const existingUser = await User.findOne({ email })
           // check for existing user
           if(existingUser) return res.status(400).json({ message:'User already exist.' })
           else {
               // add user in DB
               const user = await User.create({
                   email, 
                   password, 
                   name:`${firstName} ${lastName}`, 
                   avatar:{ 
                       public_id:'avatars/images_tncmva' , 
                       url: 'https://res.cloudinary.com/dkqoek2p3/image/upload/v1653463395/ShopIT/avatars/images_tncmva.png'
                   },
                   role
               })
               // create jwt token
               const token = user.getJwtToken()
               // options for cookie
               const options = {
                   expires: new Date(
                       Date.now() + process.env.COOKIE_EXPIRES_TIME * 1000 * 60 * 60 * 24
                   ),
                   httpOnly: true
               }
               res.status(200).cookie('token', token, options).json({ 
                success:true, 
                user, 
                token 
            })
           }
   }
)

// Forgot Password => /api/password/forgot/
module.exports.forgotPassword = catchAsync(
    /** Sends recovery email to user for reseting password */
    async(req, res) => {
        const { email } = req.body
        let user = await User.findOne({email})
        if(!user) throw(new ExpressError(404, 'User not found with this email'))
        
        // get reset token
        const resetToken = await user.getResetPasswordToken()
        await user.save({validateBeforeSave: false})

        // create reset password url
        const resetUrl = `${req.protocol}://${req.get('host')}/api/password/reset/${resetToken}`

        const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`

        try {
            await sendEmail({
                email: user.email,
                subject: 'ShopIT Password Recovery',
                message
            })

            res.status(200).json({
                success: true,
                message: `Email sent to: ${user.email}`
            })
        } catch (error) {
            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined

            await user.save({validateBeforeSave: false})

            throw( new ExpressError(500, error.message))
        }
    }
)

// Reset Password => /api/password/reset/:token
module.exports.resetPassword = catchAsync(
    async (req, res) => {
        /** Resets Password in DB */
        const {token:resetToken} = req.params
        const {password, confirmPassword} = req.body
        // Hash URL token and compare it with Hash stored in DB
        const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: {$gt: Date.now() }
        })

        if(!user) throw(new ExpressError(400, 'Password reset token is invalid or has been expired'))

        if(password !== confirmPassword) throw(new ExpressError(400, 'Password does not match'))

        // Setup new Password
        user.password = password

        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save()

        // give token
        const token = user.getJwtToken()
           // options for cookie
           const options = {
               expires: new Date(
                   Date.now() + process.env.COOKIE_EXPIRES_TIME * 1000 * 60 * 60 * 24
               ),
               httpOnly: true
           }
           res.status(200).cookie('token', token, options).json({ 
            success:true, 
            user, 
            token 
        })
    }
)

// Logout user => /api/logout
module.exports.logOut = async (req, res) => {
    // set cookie token to null
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    
    res.status(200).json({success: true, message: 'Logged out'})
} 

// Get current logged in user details => /api/me
module.exports.getUserProfile = catchAsync(
    async (req, res)=>{
        res.status(200).json({success:true, user:req.user})
    }
)