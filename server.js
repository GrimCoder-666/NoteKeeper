const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

connectDB();
const app = express();

app.use(express.json());
app.use('/api/notes', require('./routes/noteRoutes'));
app.get('/', (req,res) => {
    res.send(('Hello from Node.js!'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log('Server running on http://localhost:${PORT}');
});