const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zvb6s.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {

        await client.connect();
        const todoCollections = client.db('simple-todo-app').collection('todos')

        // get all data
        app.get('/todos', async (req, res) => {
            const result = await todoCollections.find({}).toArray();
            res.send(result)
        })


        // {
        //     "email":"sam.hasanx65@gmail.com",
        //     "name":"Complete Web Development",
        //     "des":"Need to complete web development project"
        // }
        // Add todo post api
        app.post('/todos', async (req, res) => {
            const data = req.body;
            console.log(data);
            
            const insert = await todoCollections.insertOne(data);
            res.send(insert)
        })


        // delete api
        app.delete('/todos/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const result = await todoCollections.deleteOne(filter);
            res.send(result)
        })

        // patch api 
        app.patch('/todos/:id', async(req, res)=>{
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set:{
                    status:'completed'
                }
            }
            const result = await todoCollections.updateOne(filter, updateDoc);
            res.send(result)
        })



    } finally {

    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Server Running')
})


app.listen(port, () => {
    console.log('Server Running Port: ', port);

})