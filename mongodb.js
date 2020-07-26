// const mongodb = require('mongodb')
// const ObjectID = mongodb.ObjectID
// const MongoClient =mongodb.MongoClient

const {MongoClient, ObjectID}=require('mongodb')

const connectionUrl = 'mongodb://127.0.0.1:27017'
const databaseName ='task-manager'

MongoClient.connect(connectionUrl, {useNewUrlParser:true}, (error, client)=>{
    if(error){
        return console.log("Unable to connect to database")
    }
    console.log("Connection established")
    const db=client.db(databaseName)
    // db.collection("users").insertOne({
    //     name:"Gideon",
    //     age:21
    // })

    // db.collection("Jobs").insertMany([
    //     {
    //         description:"First job",
    //         completed:false
    //     },{
    //         description:"Second Job",
    //         completed:false
    //     },{
    //         description:"Third Job",
    //         completed:true
    //     }
    // ], (error, result)=>{
    //     if(error){
    //         return console.log(error)
    //     }
    //     console.log(result.ops)

    // })

    // db.collection("Jobs").findOne({_id:new ObjectID("5f1720ebb48b76258ca36d46")}, (error, user)=>{
    //     if(error){
    //         return console.log(error)
    //     }
    //     console.log(user)
    // })

    // db.collection("Jobs").find({completed:false}).toArray((error, users)=>{
    //     if(error){
    //         return console.log(error)
    //     }
    //     console.log(users)
    // })

    // db.collection("Jobs").updateMany({completed:false},{
    //     $set:{
    //         completed:true
    //     }
    // }).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })First job

    db.collection("Jobs").deleteOne({
        description:"First job"
    }).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })
})