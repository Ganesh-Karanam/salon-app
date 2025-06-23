const express = require('express');
const User = require('./models/user'); 
const connectDB = require('./db'); 
const app = express();

// Middleware to parse JSON
app.use(express.json());
// Middleware to authenticate registered users
app.use('/api/auth', require('./routes/auth'));

// test route
app.use('/api/test', require('./routes/testrouter'));

// Connect to the database
connectDB();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
