const express = require('express')
const Task = require('../models/task')
const router = new express.Router()


//POST a task
router.post('/tasks', async (req, res)=>{
    const task = new Task(req.body)

    try{
        await task.save()
        res.status(201).send(task)
    }catch(error){
        res.status(400).send(error)
    }


})


//GET all tasks
router.get('/tasks', async (req, res)=>{

    try{
        const tasks = await Task.find({})
        res.send(tasks)
    }catch(error){
        res.status(500).send()
    }
})

//GET single task from id 
router.get('/tasks/:id', async (req,res)=>{
    const _id = req.params.id

    try{
        const task = await Task.findById(_id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(error){
        res.status(500).send()
    }

  
})


//UPDATE task 
router.patch('/tasks/:id', async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValid = updates.every((update) => allowedUpdates.includes(update))


    try{
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators: true})

        if(!task){
            return res.status(404).send()
        }
        
        res.send(task) 
    }catch(error){
        res.status(400).send(error)
    }
})

//DELETE task
router.delete('/tasks/:id', async (req, res)=>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id)

        if(!task){
            return res.status(404).send()
        }
        res.send(task)

    }catch(error){
        res.status(500).send()
    }
})

module.exports = router