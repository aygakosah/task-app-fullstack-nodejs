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

router.patch('/tasks/:id', auth, async(req, res)=>{
    const updates=Object.keys(req.body)
    const updatesAllowed=['description', 'completed']
    const Isvalid = updates.every((update)=>{
        return updates.includes(update)
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

router.delete('/tasks/:id', auth, async(req, res)=>{
    try {
        const user = await Tasks.findOneAndDelete({_id:req.params.id, owner:req.user._id})
        if(!user){
            return res.status(400).send()
        }
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
        
    }
})



module.exports=router