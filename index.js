const express = require('express');
const dotenv = require("dotenv");
const cors = require("cors");

const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
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
    const bookingCollection = db.collection("bookings");

    app.get('/destinations', async (req, res) => {
          const result =await destinationCollection.find().toArray()
          res.json(result);
    });


    app.post('/destinations', async (req, res) => {
          const destination = req.body;
          console.log(destination);
          const result =await destinationCollection.insertOne(destination);

          res.json(result);

    });

//middleware
    app.get("/destinations/:id",(req,res,next)=>{
      const header = req.headers.authorization;
      if(header==="loggedIn")
      {        next();
      }
      else{
        res.status(401).json({message:"Unauthorized"});
      }
    }
      , async (req, res) => {
      const {id} = req.params;

      const result = await destinationCollection.findOne({ _id: new ObjectId(id)});

      res.json(result);
    });


    app.patch("/destinations/:id", async (req, res) => {
      const {id} = req.params;
      const updateData = req.body;

      const result = await destinationCollection.updateOne(
        {_id: new ObjectId(id)},
        {$set: updateData}
      )

      res.json(result);
    });


    app.delete("/destinations/:id", async (req, res) => {
      const {id} = req.params;
      const result = await destinationCollection.deleteOne({_id: new ObjectId(id)});
      res.json(result);
    });

    app.get("/bookings/:userId", async (req, res) => {
      const {userId} = req.params;
      const result = await bookingCollection.find({userId}).toArray();
      res.json(result);
    });



    app.post('/bookings', async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
       res.json(result);
    });


    app.delete("/bookings/:bookingId", async (req, res) => {
      const {bookingId} = req.params;
      const result = await bookingCollection.deleteOne({_id: new ObjectId(bookingId)});
      res.json(result);
    });

    
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