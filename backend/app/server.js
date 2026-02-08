const mongoose = require('mongoose');

const uri = 'mongodb+srv://admin:<adminpw>@studybuddy.hilnv62.mongodb.net/?appName=studybuddy';

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB Atlas!'))
.catch(err => console.error('❌ MongoDB connection error:', err));
