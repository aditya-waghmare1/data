require('dotenv').config(); // Load environment variables
const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// MongoDB Atlas connection
const uri = process.env.MONGO_URI || "mongodb+srv://adiwaghmare856a:dvtdAmrE8iswJsxo@cluster0.tu1zi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Middleware
app.use(cors({ origin: '*' })); // Allow all origins (change for production)
app.use(bodyParser.json());

// MongoDB Connection
let client;
async function connectDB() {
    if (!client) {
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log("✅ Connected to MongoDB Atlas");
    }
    return client.db('User');
}

// 🚀 Signup Endpoint
app.post('/signup', async (req, res) => {
    const { email, name, password } = req.body;

    try {
        const db = await connectDB();
        const collection = db.collection('names');

        const existingUser = await collection.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const result = await collection.insertOne({ email, name, password });
        res.status(201).json({ message: 'User registered successfully!', userId: result.insertedId });
    } catch (error) {
        console.error("❌ Error registering user:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 🚀 Login Endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const db = await connectDB();
        const collection = db.collection('names');

        const user = await collection.findOne({ email, password });
        if (user) {
            res.status(200).json({ success: true, message: 'Login successful' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("❌ Error logging in:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 🚀 Submit Output Endpoint
app.post('/submit', async (req, res) => {
    const { email, output } = req.body;

    try {
        const db = await connectDB();
        const collection = db.collection('names');

        const result = await collection.updateOne(
            { email },
            { $set: { output, updatedAt: new Date() } },
            { upsert: true }
        );

        res.status(201).json({ success: true, message: 'Content submitted successfully' });
    } catch (error) {
        console.error('❌ Error submitting content:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// 🚀 Fetch Names Endpoint
app.get('/fetch-names', async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('names');

        const users = await collection.find({}, { projection: { _id: 0, name: 1, email: 1 } }).toArray();
        res.status(200).json(users);
    } catch (error) {
        console.error("❌ Error fetching names:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 🚀 Fetch Output by Email
app.get('/fetch-output/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const db = await connectDB();
        const collection = db.collection('names');

        const user = await collection.findOne({ email }, { projection: { _id: 0, output: 1 } });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("❌ Error fetching output:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
