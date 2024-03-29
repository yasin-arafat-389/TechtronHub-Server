const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5001;

// Middlewares
app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
  const products = client.db("TechtronHub").collection("AllProducts");
  const orders = client.db("TechtronHub").collection("OrderInfo");

  try {
    // Get Brand names and images API
    app.get("/brands", async (req, res) => {
      const result = await brandCollection.find().toArray();
      res.send(result);
    });

    // Get single Brand name and info API
    app.get("/brands/:path", async (req, res) => {
      let path = req.params.path;
      const query = { path: path };
      const result = await brandCollection.findOne(query);
      res.send(result);
    });

    // Post data from add product
    app.post("/add", async (req, res) => {
      const { image, name, brand, type, price, shortDesc, rating } = req.body;

      const result = await products.insertOne({
        image,
        name,
        brand,
        type,
        price,
        shortDesc,
        rating,
      });
      res.send(result);
    });

    // Post data from add product
    app.get("/products", async (req, res) => {
      const result = await products.find().toArray();
      res.send(result);
    });

    // Post data from add product
    app.get("/products/:id", async (req, res) => {
      let id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await products.findOne(query);
      res.send(result);
    });

    // Post API to store order details in the orders collection
    app.post("/order", async (req, res) => {
      const { image, brand, name, price, currentUser } = req.body;
      const result = await orders.insertOne({
        image,
        brand,
        name,
        price,
        currentUser,
      });
      res.send(result);
    });

    // GET api to get all the data from orders collection
    app.get("/orders", async (req, res) => {
      const result = await orders.find().toArray();
      res.send(result);
    });

    // GET api to get single data from orders collection by email
    app.get("/orders/:email", async (req, res) => {
      let email = req.params.email;
      const query = { currentUser: email };
      const result = await orders.find(query).toArray();
      res.send(result);
    });

    // Delete api to delete data from orders
    app.delete("/delete/:id", async (req, res) => {
      let id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await orders.deleteOne(query);
      res.send(result);
    });

    // Put requesting handling when user wants to update a data
    app.put("/update/:id", async (req, res) => {
      const { id } = req.params;
      const { image, name, brand, type, price, rating } = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          image,
          name,
          brand,
          type,
          price,
          rating,
        },
      };
      const result = await products.updateOne(filter, updateDoc, options);
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
