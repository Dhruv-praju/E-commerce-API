const mongoose = require('mongoose')
const {Schema, model} = mongoose
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    avatar:{
        public_id:{
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role:{
        type: String,
        default: 'user'
    },
    createdAt:{
        type: String,
        default: (new Date()).toISOString().slice(0, 10).split("-").reverse().join("/")
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

userSchema.pre('save', async function(next){
    /* Hashes the password before storing it */
    this.password = await bcrypt.hash(this.password, 12)
})

userSchema.methods.getJwtToken = function(){
    /* Returns JWT token */
    // generate token by signing with email
    const token = jwt.sign({email:this.email, id:this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_TIME})
    return token
}

userSchema.methods.comparePassword = async function(enteredPassword){
    /* Compares entered password with the hashed password in DB */
    const result = await bcrypt.compare(enteredPassword, this.password)
    return result
}

userSchema.methods.getResetPasswordToken = async function(){
    /** Returns token to reset password */
    // generate token
    const token = crypto.randomBytes(20).toString('hex')
    // hash the token and store hash 
    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')
    // set token expire time
    this.resetPasswordExpire = Date.now() + 30 * 1000 * 60
    return token
}

const User = new model('User',userSchema)
module.exports = User