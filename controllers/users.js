const User = require("../models/user")
const catchAsync = require("../utils/catchAsync")

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

// Logout user => /api/logout
module.exports.logOut = async (req, res) => {
    // set cookie token to null
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    
    res.status(200).json({success: true, message: 'Logged out'})
} 