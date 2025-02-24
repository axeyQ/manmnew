// src/models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  image: String,
  emailVerified: Date,
  accounts: [{
    provider: String,
    providerAccountId: String,
    type: String,
    access_token: String,
    expires_at: Number,
    scope: String,
    id_token: String,
    session_state: String
  }]
}, { 
  timestamps: true,
  strict: false  // This allows for flexible account data
});

export default mongoose.models.User || mongoose.model('User', UserSchema);