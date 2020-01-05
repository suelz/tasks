///Users/conor/mongodb/bin/mongod.exe --dbpath=/Users/conor/mongodb-data

const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/task-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})