const mongoose = require('mongoose')
const validator = require('validator')
const bcrpyt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
        trim: true,
    },
    email:{
        type: String,
        unique: true,
        require: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('must be a valid email')
            }
        }
    },
    password:{
        type: String,
        require: true,
        minlength: 7,
        trim: true,
        validate(value){
            if(value.includes('password')){
                throw new Error('password cant be password')
            }
        }
        
    },
    age:{
        type: Number,
        default: 0, 
        validate(value){
            if(value < 0){
                throw new Error('age must be postive')
            }
        }
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
})

userSchema.methods.generateAuthToken = async function (){
    const user = this
    const token = jwt.sign({_id: user.toString()}, 'key')

    user.tokens = user.tokens.concat({token})
    await user.save()
    return token


}

userSchema.statics.findByCredentials = async (email, password) =>{
    const user = await User.findOne({email})
    
    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrpyt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user

}

//plain text password hash
userSchema.pre('save', async function (next) {
    const user = this

    if(user.isModified('password')){
        user.password = await bcrpyt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User