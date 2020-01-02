const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-api', {
    useNewUrlParser: true,
    useCreateIndex: true
})


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

const Task = mongoose.model('Task',{
    description:{
        type: String,
        require: true,
        trim: true,
    },
    completed:{
        type: Boolean,
        default: false
    }
})

const task = new Task({
    description:'code today',
    completed: true
})

task.save().then(()=>{
    console.log(task)
}).catch((error)=>{
    console.log('error', erorr)
})

// const me = new User({
//     name:'Conor',
//     email:'Conor@gmail.com',
//     password:'catsanddogs123'
// })

// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log('error', error)
// })