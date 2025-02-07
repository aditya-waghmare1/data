const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

// MongoDB Atlas connection string
const uri = "mongodb+srv://adiwaghmare856a:dvtdAmrE8iswJsxo@cluster0.tu1zi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Initialize express
const app = express();

// CORS configuration: Allow requests from your frontend domain
const corsOptions = {
    origin: 'https://data-1s25.vercel.app',  // Allow your frontend's domain
    methods: 'GET,POST',  // Allow specific HTTP methods
    allowedHeaders: 'Content-Type,Authorization', // Allow specific headers
};

// Use CORS with options
app.use(cors(corsOptions));
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

// Handle submit POST request
app.post('/submit', async (req, res) => {
    const { email, output } = req.body;

    let client;
    try {
        client = new MongoClient(uri);
        await client.connect();
        console.log("Connected successfully to MongoDB Atlas");

        const database = client.db('User');
        const collection = database.collection('names');

        const result = await collection.updateOne(
            { email },
            { $set: { output, updatedAt: new Date() } },
            { upsert: true }
        );

        if (result.matchedCount > 0) {
            console.log(`Document updated with email: ${email}`);
        } else {
            console.log(`New document inserted with email: ${email}`);
        }

        res.status(201).json({ success: true, message: 'Content submitted successfully' });
    } catch (error) {
        console.error('Error submitting content:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
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

// Handle fetch output GET request
app.get('/fetch-output/:email', async (req, res) => {
    const { email } = req.params;

    let client;
    try {
        client = new MongoClient(uri);
        await client.connect();
        console.log("Connected successfully to MongoDB Atlas");

        const database = client.db('User');
        const collection = database.collection('names');

        const user = await collection.findOne({ email }, { projection: { _id: 0, output: 1 } });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Error fetching output:", error);
        res.status(500).json({ message: 'Error fetching output' });
    } finally {
        if (client) {
            await client.close();
            console.log("MongoDB client closed.");
        }
    }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
