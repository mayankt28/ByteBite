import mongoose from 'mongoose';

const userAnalyticsSchema = new mongoose.Schema({
  totalUsers: { type: Number, default: 0 },
  roleCounts: {
    customer: { type: Number, default: 0 },
    employee: { type: Number, default: 0 },
    manager: { type: Number, default: 0 },
    admin: { type: Number, default: 0 }
  },
  dailyRegistrations: [
    {
      date: String, // 'YYYY-MM-DD'
      count: { type: Number, default: 0 }
    }
  ]
});

export default mongoose.model('UserAnalytics', userAnalyticsSchema);
