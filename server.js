const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5001;

// Middlewares
app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gef2z8f.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  const brandCollection = client.db("TechtronHub").collection("BrandInfo");

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    // Brand names and images API
    app.get("/brands", async (req, res) => {
      const result = await brandCollection.find().toArray();
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is up and running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
