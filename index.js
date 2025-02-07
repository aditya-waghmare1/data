const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

// MongoDB Atlas connection string
const uri = "mongodb+srv://adiwaghmare856a:dvtdAmrE8iswJsxo@cluster0.tu1zi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Handle signup POST request
app.post('/signup', async (req, res) => {
    const { email, name, password } = req.body;

    let client;
    try {
        client = new MongoClient(uri);
        await client.connect();
        console.log("Connected successfully to MongoDB Atlas");

        const database = client.db('User');
        const collection = database.collection('names');

        const result = await collection.insertOne({ email, name, password });
        console.log(`New document inserted with _id: ${result.insertedId}`);

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error("Error connecting to MongoDB Atlas or registering user:", error);
        res.status(500).json({ message: 'Error registering user' });
    } finally {
        if (client) {
            await client.close();
            console.log("MongoDB client closed.");
        }
    }
});

// Handle login POST request
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    let client;
    try {
        client = new MongoClient(uri);
        await client.connect();
        console.log("Connected successfully to MongoDB Atlas");

        const database = client.db('User');
        const collection = database.collection('names');

        const user = await collection.findOne({ email, password });
        if (user) {
            res.status(200).json({ success: true, message: 'Login successful' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Error connecting to MongoDB Atlas or logging in:", error);
        res.status(500).json({ message: 'Error logging in' });
    } finally {
        if (client) {
            await client.close();
            console.log("MongoDB client closed.");
        }
    }
});

// Handle fetch names GET request
app.get('/fetch-names', async (req, res) => {
    let client;
    try {
        client = new MongoClient(uri);
        await client.connect();
        console.log("Connected successfully to MongoDB Atlas");

        const database = client.db('User');
        const collection = database.collection('names');

        const users = await collection.find({}, { projection: { _id: 0, name: 1, email: 1 } }).toArray();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching names:", error);
        res.status(500).json({ message: 'Error fetching names' });
    } finally {
        if (client) {
            await client.close();
            console.log("MongoDB client closed.");
        }
    }
});

// Vercel requires a request handler for serverless functions
module.exports = app;
