// EzLabs/server/server.js (or index.js) - Additions
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
// NEW: Import bookingRoutes
const bookingRoutes = require('./routes/bookingRoutes'); // Import booking routes

const { protect } = require('./middleware/authMiddleware');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
// NEW: Booking Routes
app.use('/api/bookings', bookingRoutes); // Mount booking routes at /api/bookings

app.get('/api/user/profile', protect, (req, res) => {
  res.json({
    message: `Welcome to your protected profile, user ID: ${req.user}`,
    data: { userId: req.user, secretInfo: "This is top secret!" }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB connected successfully!`);
});