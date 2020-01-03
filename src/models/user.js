const mongoose = require('mongoose')
const validator = require('validator')


const User = mongoose.model('User',{
    name:{
        type: String,
        require: true,
        trim: true,
    },
    email:{
        type: String,
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
    }
})

module.exports = User