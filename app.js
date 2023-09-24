const express = require('express');
const app = express();
const port = 3000;
// Configure middleware to parse JSON data
app.use(express.json());

// Connect to MongoDB
const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb://localhost:27017/contactdb';
const client = new MongoClient(uri, { useNewUrlParser: true,
useUnifiedTopology: true });
let contactCollection;
client.connect((err) => {
if (err) {
console.error('Error connecting to MongoDB:', err);
return;
}
contactCollection = client.db().collection('contacts');
console.log('Connected to MongoDB');
});

// Define routes
app.get('/', (req, res) => {
res.send('Welcome to the Contact Search API');
});
app.get('/contacts', (req, res) => {
contactCollection.find().toArray((err, contacts) => {
if (err) {
console.error('Error retrieving contacts:', err);
res.status(500).json({ error: 'Failed to retrieve contacts' });
return;
}
res.json(contacts);
});
});
app.get('/contacts/:name', (req, res) => {
const name = req.params.name;
contactCollection.findOne({ name }, (err, contact) => {
if (err) {
console.error('Error retrieving contact:', err);
res.status(500).json({ error: 'Failed to retrieve contact' });
return;
}
if (!contact) {
res.status(404).json({ error: 'Contact not found' });
return;
}
res.json(contact);
});
});

// Start the server
app.listen(port, () => {
console.log(`Server started on port ${port}`);
});