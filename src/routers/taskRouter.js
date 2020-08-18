const express =require('express')
const Tasks = require('../models/tasks')
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/tasks', auth,  async(req, res)=>{
    const task = new Tasks({
        ...req.body,
        owner:req.user._id
    })
    try{
        await task.save()
        res.status(200).send(task)
    }catch(e){
        res.status(400).send(e)
    }

})

router.get('/tasks',auth, async(req, res)=>{
    try {
        const match={}
        const sort ={}
        if(req.query.completed){
            match.completed=req.query.completed==='true'
        }
        if(req.query.sortBy){
            const parts =req.query.sortBy.split(':')
            sort[parts[0]]=parts[1]=='desc'?-1:1
        }
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
            
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send()
        
    }
})

router.get('/tasks/:id',auth, async (req, res)=>{
    const _id = req.params.id
    try {
        const task =await Tasks.findOne({_id, owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()   
    }
})
router.get('/taskbyname/:description', auth, async(req, res)=>{
    // const whichTask = req.query.description
    // const array = whichTask.split('%20')
    // let final =""
    // array.forEach(element => {
    //     final+=element+" "
    // });
    // final.trim()
    // console.log(final)
    try {
        const task = await Tasks.findOne({description:req.params.description, owner:req.user._id})
        if(!task){
            res.status(401).send({error:"Name not recognized"})
        }
        res.send(task)
        console.log(req.query)
    } catch (error) {
        res.status(500).send(error)
    }
})
router.patch('/tasksupdate', auth, async(req, res)=>{
    const whichTask = req.query.description
    const array = whichTask.split('%20')
    let final =""
    array.forEach(element => {
        final+=element+" "
    });
    final.trim()
    console.log(final)
    const updates=Object.keys(req.body)
    console.log(updates)
    const updatesAllowed=['description', 'completed']
    const Isvalid = updates.every((update)=>{
        return updatesAllowed.includes(update)
    })
    if(!Isvalid){
        return res.status(400).send({error:"Invalid change"})
    }
    try {
        const task = await Tasks.findOne({description:final, owner:req.user._id})
        
        if(!task){
            return res.status(401).send()
        }
        updates.forEach(update => {
            task[update]=req.body[update]
        });
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})
router.patch('/tasks/:id', auth, async(req, res)=>{
    const updates=Object.keys(req.body)
    const updatesAllowed=['description', 'completed']
    const Isvalid = updates.every((update)=>{
        return updatesAllowed.includes(update)
    })
    if(!Isvalid){
        return res.status(400).send({error:"Invalid change"})
    }
    try {
        const task = await Tasks.findOne({_id:req.params.id, owner:req.user._id})
        
        if(!task){
            return res.status(401).send()
        }
        updates.forEach(update => {
            task[update]=req.body[update]
        });
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/tasks/:description', auth, async(req, res)=>{
    try {
        console.log(req.params.description)
        const user = await Tasks.findOneAndDelete({description:req.params.description, owner:req.user._id})
        if(!user){
            return res.status(400).send()
        }
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
        
    }
})



module.exports=router