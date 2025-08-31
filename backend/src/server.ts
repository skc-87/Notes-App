import app from './app';
import { googleClient } from './config/googleAuth';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  
  // Check Google Auth status
  if (process.env.GOOGLE_CLIENT_ID) {
    console.log(`✅ Google Sign-In configured with Client ID: ${process.env.GOOGLE_CLIENT_ID.substring(0, 10)}...`);
    console.log(`🔗 Google Auth endpoint: http://localhost:${PORT}/api/auth/google`);
  } else {
    console.log('❌ Google Sign-In not configured - set GOOGLE_CLIENT_ID in .env');
  }
  
  console.log(`🗄️ MongoDB connected for note storage`);
});