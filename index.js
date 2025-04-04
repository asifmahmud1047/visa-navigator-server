const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Add a root route for checking if the server is alive
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Visa Navigator API is running',
    status: 'success',
    timestamp: new Date()
  });
});

// MongoDB Connection
const uri = process.env.MONGODB_URI || `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rhlcsrq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Improved MongoDB connection with better error handling
mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    // Don't crash the server if MongoDB connection fails
  });

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

// Routes
const visaRoutes = require('./routes/visa.routes');
const applicationRoutes = require('./routes/application.routes');
const userRoutes = require('./routes/user.routes');

app.use('/api/visas', visaRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 