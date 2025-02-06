const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Enable CORS for all origins
app.use(cors({
    origin: '*', // Change '*' to your frontend domain in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));

app.use(bodyParser.json());

// 🔹 MongoDB Atlas connection string (Use environment variables for security)
const uri = process.env.MONGO_URI || "mongodb+srv://adiwaghmare856a:dvtdAmrE8iswJsxo@cluster0.tu1zi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// ✅ Root Route (Check if server is running)
app.get('/', (req, res) => {
    res.send("Server is running...");
});

// ✅ Signup Route
app.post('/signup', async (req, res) => {
    const { email, name, password } = req.body;

    let client;
    try {
        client = new MongoClient(uri);
        await client.connect();
        const database = client.db('User');
        const collection = database.collection('names');

        const result = await collection.insertOne({ email, name, password });
        res.status(201).json({ message: 'User registered successfully!', userId: result.insertedId });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: 'Error registering user' });
    } finally {
        if (client) await client.close();
    }
});

// ✅ Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    let client;
    try {
        client = new MongoClient(uri);
        await client.connect();
        const database = client.db('User');
        const collection = database.collection('names');

        const user = await collection.findOne({ email, password });
        if (user) {
            res.status(200).json({ success: true, message: 'Login successful' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Error logging in' });
    } finally {
        if (client) await client.close();
    }
});

// ✅ Fetch Names Route
app.get('/fetch-names', async (req, res) => {
    let client;
    try {
        client = new MongoClient(uri);
        await client.connect();
        const database = client.db('User');
        const collection = database.collection('names');

        const users = await collection.find({}, { projection: { _id: 0, name: 1, email: 1 } }).toArray();
        res.status(200).json(users);
    } catch (error) {
        console.error("Fetch Names Error:", error);
        res.status(500).json({ message: 'Error fetching names' });
    } finally {
        if (client) await client.close();
    }
});

// ✅ Fetch Output by Email Route
app.get('/fetch-output/:email', async (req, res) => {
    const { email } = req.params;

    let client;
    try {
        client = new MongoClient(uri);
        await client.connect();
        const database = client.db('User');
        const collection = database.collection('names');

        const user = await collection.findOne({ email }, { projection: { _id: 0, output: 1 } });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Fetch Output Error:", error);
        res.status(500).json({ message: 'Error fetching output' });
    } finally {
        if (client) await client.close();
    }
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
