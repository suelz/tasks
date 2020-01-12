const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

//POST user
router.post('/users', async (req, res)=>{
    const user = new User(req.body)

    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }catch(error){
        res.status(400).send(error)
    }

})

//LOGIN A USER
router.post('/users/login', async (req, res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})

    }catch(error){
        res.status(400).send()
    }
})

//LOGOUT user
router.post('/users/logout', auth, async(req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(error){
        res.status(500).send()

    }
})

//LOGOUT ALL user sessions
router.post('/users/logoutall', auth, async(req, res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(error){
        res.status(500).send()

    }
})

//GET the current user
router.get('/users/me', auth, async (req, res)=>{
    res.send(req.user)
})

//GET single user from id 
router.get('/users/:id', async (req,res)=>{
    const _id = req.params.id

    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(error){
        res.status(500).send()
    }
})


//UPDATE user
router.patch('/users/:id', async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValid = updates.every((update) => allowedUpdates.includes(update))


    if(!isValid){
        return res.status(400).send({error: 'Not a valid update'})
    }

    try{
        const user = await User.findById(req.params.id)
        updates.forEach((update)=>user[update] = req.body[update])
        await user.save()


        if(!user){
            return res.status(404).send()
        }

        res.send(user)

    }catch(error){
       res.status(400).send(error)
    }
})

//DELETE user
router.delete('/users/:id', async (req, res) =>{
    try{
        const user = await User.findByIdAndDelete(req.params.id)

        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(error){
        res.status(500).send()
    }
})


module.exports = router