const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qpfli06.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const classCollection = client.db('wolvesDb').collection('allClasses');
        const selectCollection = client.db('wolvesDb').collection('select');

        // find all data from class collection
        app.get('/class', async (req, res) => {
            const result = await classCollection.find().toArray();
            res.send(result)
        })

        // select collections
        app.get('/select', async (req, res) => {
            const email = req.query.email;
            console.log(email)
            if (!email) {
                return ([]);
            }
            const query = { email: email }
            const result = await selectCollection.find(query).toArray();
            res.send(result)
        })

        app.post('/select', async (req, res) => {
            const item = req.body;
            console.log(item)
            const result = await selectCollection.insertOne(item);
            res.send(result)
        })

        app.delete('/select/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await selectCollection.deleteOne(query);
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("api is running")
})
app.listen(port, () => {
    console.log('server is running')
})