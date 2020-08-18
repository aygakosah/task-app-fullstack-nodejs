const express =require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeMail } = require('../email/account')
//Email codes will use them later
// const {sendWelcomeMail, sendCancellationMail}= require('../emai/account')

router.post('/users', async(req, res)=>{
    console.log('fuck')
    const user = new User(req.body)
    
    try{
        const token = await user.genAuthToken()
        res.status(201).send({user, token})
        await user.save()
        // sendWelcomeMail(user.email, user.name)
    }catch(e){
        res.status(404).send(e)
    }
    
})



router.post('/users/login', async (req, res)=>{
    try {
        const user =await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.genAuthToken()
        res.status(200).send({user, token})
    } catch (error) {
        res.status(404).send(error)
    }
})
router.post('/users/logout', auth,  async(req, res)=>{
    console.log('Logged out')
    try {
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!=req.token
        })
        await req.user.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/users/logoutall', auth, async(req, res)=>{
    try {
        req.user.tokens=[]
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})
router.get('/users/me', auth,  async(req, res)=>{
   res.send(req.user)
})



router.patch('/users/me', auth, async(req, res)=>{
    const updates =Object.keys(req.body)
    const updatesAllowed = ['name', 'age', 'email', 'password']
    const Isvalid = updates.every((update)=>{
        return updatesAllowed.includes(update)
    })
    if(!Isvalid){
       return res.status(400).send({error:"Invalid update operation"})
    }
    
    try {
        updates.forEach(update => {
            req.user[update]=req.body[update]
        });
        await req.user.save()
        res.send(req.user) 
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/users/me', auth,  async(req, res)=>{
    try {
        await req.user.remove()
        // sendCancellationMail(req.user.email, req.user.name)
        res.status(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})
const upload =multer({
    // dest:'avatar',
    limits:{
        fileSize:1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(new Error('File must be a jpg, jpeg or png'))
        }else{
            cb(undefined, true)
        }
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send()
}, (error, req, res, next)=>{
    res.status(400).send({error:"Please upload a jpg, jpeg or png file"})
} )

router.delete('/users/me/avatar', auth, async(req, res)=>{
    req.user.avatar=undefined
    await req.user.save()

    res.send()
})

router.get('/users/:id/avatar', async (req, res)=>{
    try {
        const user = await User.findById(req.params.id)
        if(!user||!user.avatar){
            throw new Error()
        }
        res.set('Content-Type', '/image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send()
    }
})

module.exports=router