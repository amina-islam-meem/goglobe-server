const express = require('express');
const dotenv = require("dotenv");
const cors = require("cors");

const { MongoClient, ServerApiVersion } = require('mongodb');
dotenv.config();
const uri =process.env.MONGODB_URI;

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());



const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const db = client.db("goglobe-server")
    const destinationCollection = db.collection("destinations");


    app.post('/destinations', async (req, res) => {
          const destination = req.body;
          console.log(destination);
          const result =await destinationCollection.insertOne(destination);

          res.json(result);

    })



    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error(error);
  }
  
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});