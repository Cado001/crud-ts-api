// 1. import packages
import express from 'express'
import cors from 'cors'
import {MongoClient, ObjectId,  } from 'mongodb'
import 'dotenv/config'
import bcrypt from 'bcrypt-ts'


// 2. Use packages
const app = express()
app.use(cors())
app.use(express.json())

const client = new MongoClient(process.env.MONGO_URI as string)
const db = client.db('dinos-store')
const users = db.collection('users')

client.connect()
console.log('Connected to Mongo')




// 3. listen on port
// 4. create a get endpoint
app.listen(process.env.PORT,  () => console.log('app listening on port 8080 😎')) 


// 4. create a get endpoint 
app.get('/', async (req, res) => {
    const allUsers = await users.find().toArray()
    res.send(allUsers)
})

// 5. Create a get endpoint 

app.post('/', async (req, res) => {
    const userEmail = req.body.email
    const userPassword = req.body.password

   const hashPass= bcrypt.hash(req.body.password, 10)
    const userAdded = await users.insertOne({ email: userEmail, password: hashPass})
    res.status(201).send(userAdded)
})


app.delete ('/:_id', async (req, res) => {
    const cleanId = new ObjectId(req.params._id)
    console.log('req.params ->' , req.params)
    const userDeleted = await users.findOneAndDelete({ email: req.params._id})
    res.send(userDeleted)
})

// login 
app.post('/login', async (req, res) => {
    const userPassword = req.body.password
    const foundUser = await users.findOne({ email: req.body.email })

    if(foundUser){
    const passInDb = foundUser?.password
    const result = await bcrypt.compare(userPassword, passInDb)
    console.log('result ->', result)
    res.send(foundUser)
    } else {
        res.json('User not found !!! ❌')
    }
})





app.patch ('/:email', async (req, res) => {
    console.log('req.params -> ' , req.params)
    const itemUpdated = await users.findOneAndUpdate({ email: req.params.email }, {$set: { password: 'nada'}})
    res.send(itemUpdated)
})