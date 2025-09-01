import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  
  if (process.env.GOOGLE_CLIENT_ID) {
    console.log(`✅ Google Sign-In configured`);
  } else {
    console.log('❌ Google Sign-In not configured - set GOOGLE_CLIENT_ID in .env');
  }
});