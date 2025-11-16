const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('Full Error:', error);
    // Don't exit, let the app show the error
    setTimeout(() => {
      console.log('Retrying connection in 5 seconds...');
      connectDB();
    }, 5000);
  }
};

module.exports = connectDB;
