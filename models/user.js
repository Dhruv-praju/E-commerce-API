const mongoose = require('mongoose')
const {Schema, model} = mongoose
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
    }
})

userSchema.pre('save', async function(next){
    /* Hashes the password before storing it */
    this.password = await bcrypt.hash(this.password, 12)
})

userSchema.methods.getJwtToken = function(){
    /* Returns JWT token */
    // generate token by signing with email
    const token = jwt.sign({email:this.email, id:this._id}, 'secretkey', {expiresIn: process.env.JWT_EXPIRES_TIME})
    return token
}

userSchema.methods.comparePassword = async function(enteredPassword){
    /* Compares entered password with the hashed password in DB */
    const result = await bcrypt.compare(enteredPassword, this.password)
    return result
}

const User = new model('User',userSchema)
module.exports = User