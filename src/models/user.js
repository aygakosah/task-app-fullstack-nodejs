const mongoose = require('mongoose')
const validator =require('validator')
const bcrypt = require('bcryptjs')
const jwt =require('jsonwebtoken')
const Tasks = require('./tasks')
const sharp = require('sharp')


const userSchema =new mongoose.Schema({
    name:{
        type: String,
        trim:true,
        require:true
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error("Age cannot be negative")
            }
        }

    }, 
    email:{
       type:String,
       require:true,
       unique:true,
       trim:true,
       validate(value){
           if(!validator.isEmail(value)){
               throw new Error("Email is invalid")
           }
       }

    },
    password:{
        type: String,
        require: true, 
        validate(value){
            if(value.length<6){
                throw new Error("Password is too short")
            }else if(value.includes("password")){
                throw new Error("Password should not include password")
            }

        }
    }, 
    tokens:[{
        token:{
            type:String,
            require:true
        }
        
    }],
    avatar:{
        type:Buffer
    }
}, {
    timestamps:true
})

userSchema.virtual('tasks', {
    ref:'Tasks',
    localField:'_id',
    foreignField:'owner'
})
userSchema.methods.toJSON = function(){
    const user = this
    const userObject =user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}
//Generates authentication keys
userSchema.methods.genAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()}, process.env.JSONWEBTOKEN)
    user.tokens =user.tokens.concat({token})
    await user.save()
    return token
}

//Find a user by credentials login
userSchema.statics.findByCredentials = async(email, password)=>{
    const user = await User.findOne({email})
    if(!user){
         throw new Error("Unable to login!")
    }
    const isMatch= await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error("Unable to login!")
    }
    return user
}
//User can change password here
userSchema.pre('save', async function(next){
    const user=this
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password, 8)
    }
    next()
})

//Delete all tasks when user is removed

userSchema.pre('remove', async function(next){
    const user= this
    await Tasks.deleteMany({owner:user._id})
    next()
})

const User = mongoose.model('User', userSchema)
   

module.exports=User