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

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
  });

// Basic Route
app.get('/', (req, res) => {
  res.send('Culinary Inventory API is running...');
});

// Import Routes (To be added later)
const rawMaterialRoutes = require('./routes/rawMaterialRoutes');
const finishedGoodRoutes = require('./routes/finishedGoodRoutes');

app.use('/api/raw-materials', rawMaterialRoutes);
app.use('/api/finished-goods', finishedGoodRoutes);
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/production', require('./routes/productionRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));


