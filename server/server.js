const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
// NEW: Import labTestRoutes
const labTestRoutes = require('./routes/labTestRoutes'); 

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
app.use('/api/bookings', bookingRoutes);
// NEW: Lab Test Routes
app.use('/api/labresults', labTestRoutes); 

app.get('/api/user/profile', protect, (req, res) => {
  res.json({
    message: `Welcome to your protected profile, user ID: ${req.user.id}`, 
    data: { userId: req.user, secretInfo: "This is top secret!" }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB connected successfully!`);
});