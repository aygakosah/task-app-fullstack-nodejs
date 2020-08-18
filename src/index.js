const express =require('express')
const path = require('path')
const dotenv = require('dotenv')
require('./db/mongoose.js')
const User = require('./models/user.js')
const Tasks = require('./models/tasks.js')
const userRouter =require('./routers/userRouter')
const taskRouter =require('./routers/taskRouter')
const publicDirectory=path.join(__dirname, '../public')

dotenv.config()
const app =express()


const port =process.env.PORT 
// app.use((req, res, next)=>{
//     const maintenace="SITE UNDER MAINTENACE"
//     res.status(503).send(maintenace)
// })
app.use(express.static(publicDirectory))
app.use(express.json())
// app.use(express.urlencoded())
app.use(userRouter)
app.use(taskRouter)



app.listen(port, ()=>{
    console.log("Server is listening on port"+port)
})

