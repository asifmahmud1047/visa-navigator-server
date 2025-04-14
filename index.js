require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5b559.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

    const database = client.db("visaDB");
    const visaColection = database.collection("Allvisa");

    const Database = client.db("applyDB");
    const applyColection = Database.collection("Allapply");

    app.get("/visa", async (req, res) => {
      const data = visaColection.find();
      const result = await data.toArray();
      res.send(result);
    });

    app.put("/visa/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const data = req.body;
      const options = { upsert: true };
      const updateData = {
        $set: {
          name: data.name,
          description: data.description,
          age: data.age,
          applicationMethod: data.applicationMethod,
          validity: data.validity,
          fee: data.fee,
          time: data.time,
          visaType: data.visaType,
        },
      };
      const result = await visaColection.updateOne(query, updateData, options);

      res.send(result);
    });
    app.get("/latest-visas", async (req, res) => {
      const data = visaColection.find().sort({ _id: -1 }).limit(6);
      const result = await data.toArray();
      res.send(result);
    });

    app.get("/visa/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await visaColection.findOne(query);
      res.send(result);
    });

    app.post("/visa", async (req, res) => {
      const Newvisa = req.body;
      const result = await visaColection.insertOne(Newvisa);
      res.send(result);
    });

    app.get("/my-visas", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const data = visaColection.find(query);
      const result = await data.toArray();
      res.send(result);
    });

    app.delete("/visa/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await visaColection.deleteOne(query);
      res.send(result);
    });

    app.get("/apply", async (req, res) => {
      const { searchPrams } = req.query;
      let option = {};
      if (searchPrams) {
        option = { name: { $regex: searchPrams, $options: "i" } };
      }
      const data = applyColection.find(option);
      const result = await data.toArray();
      res.send(result);
    });

    app.post("/apply", async (req, res) => {
      const Apply = req.body;
      const result = await applyColection.insertOne(Apply);
      res.send(result);
    });

    app.delete("/apply/:id", async (req, res) => {
      const data = req.params.id;
      const query = { _id: new ObjectId(data) };
      const result = await applyColection.deleteOne(query);
      res.send(result);
    });
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
  res.send("assignment 10 server is running");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
