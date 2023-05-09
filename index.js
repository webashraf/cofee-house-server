const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middel ware //
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mjqzlpi.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeCollection = client.db("cofeeDb").collection("newCoffe");

    app.get("/coffee", async (req, res) => {
      const cursor = coffeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };
      const result = await coffeCollection.findOne(quary);
      res.send(result);
    });

    app.post("/coffee", async (req, res) => {
      const newCoffe = req.body;
      console.log(newCoffe);
      const result = await coffeCollection.insertOne(newCoffe);
      res.send(result);
    });

    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const coffeeData = req.body;
      const filter = { _id: new ObjectId(id)};
      const options = { upsert: true };
      const updatedCoffee = {
        $set: {
          name: coffeeData.name,
          supplier: coffeeData.supplier,
          category: coffeeData.category,
          chef: coffeeData.chef,
          taste: coffeeData.taste,
          details: coffeeData.details,
          photo: coffeeData.photo,
        },
      };
      const result = await coffeCollection.updateOne(filter, updatedCoffee, options)
      res.send(result);
    });

    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = coffeCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Coffe House Server is running");
});

app.listen(port, () => {
  console.log("http://localhost:" + port);
});
