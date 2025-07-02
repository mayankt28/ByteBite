import { Kafka } from 'kafkajs';
import UserAnalytics from '../models/UserAnalytics.js';
import OrderAnalytics from '../models/OrderAnalytics.js';
import ReviewAnalytics from '../models/ReviewAnalytics.js';
import MenuItemRatings from '../models/MenuItemRatings.js';
import RestaurantPerformance from '../models/RestaurantPerformance.js';

const kafka = new Kafka({
  clientId: 'analytics-service',
  brokers: [process.env.KAFKA_BROKER]
});

const consumer = kafka.consumer({ groupId: 'analytics-group' });

const getToday = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

const incrementDailyOrderStats = async (restaurantId, updates = {}) => {
  const date = getToday();

  await OrderAnalytics.findOneAndUpdate(
    { date, restaurantId },
    { $inc: updates },
    { upsert: true, new: true }
  );

  // Platform-wide stats
  if (restaurantId) {
    await OrderAnalytics.findOneAndUpdate(
      { date, restaurantId: null },
      { $inc: updates },
      { upsert: true, new: true }
    );
  }
};


const updateRestaurantPerformance = async (restaurantId, updates = {}) => {
  if (!restaurantId) return;
  await RestaurantPerformance.findOneAndUpdate(
    { restaurantId },
    { $inc: updates },
    { upsert: true, new: true }
  );
};



const ensureRestaurantPerformance = async (restaurantId) => {
  const exists = await RestaurantPerformance.findOne({ restaurantId });
  if (!exists) {
    await RestaurantPerformance.create({
      restaurantId,
      totalOrders: 0,
      completedOrders: 0,
      cancelledOrders: 0,
      totalRevenue: 0,
      totalReviews: 0,
      averageRating: 0
    });
  }
};


// ========================= Event Handlers ========================= //

const handleUserCreated = async (data) => {
  const today = getToday();

  let analytics = await UserAnalytics.findOne();

  if (!analytics) {
    console.log('📊 Creating new UserAnalytics document');
    analytics = await UserAnalytics.create({
      totalUsers: 0,
      roleCounts: { customer: 0, employee: 0, manager: 0, admin: 0 },
      dailyRegistrations: []
    });
  }

  await UserAnalytics.updateOne(
    { _id: analytics._id },
    {
      $inc: {
        totalUsers: 1,
        [`roleCounts.${data.role}`]: 1
      }
    }
  );

  const todayExists = analytics.dailyRegistrations.some(r => r.date === today);

  if (todayExists) {
    await UserAnalytics.updateOne(
      { 'dailyRegistrations.date': today },
      { $inc: { 'dailyRegistrations.$.count': 1 } }
    );
  } else {
    await UserAnalytics.updateOne(
      { _id: analytics._id },
      { $push: { dailyRegistrations: { date: today, count: 1 } } }
    );
  }
};

const handleOrderPlaced = async (data) => {
  const { restaurantId, totalAmount, referralCode, deliveryArea } = data;

  const updates = {
    totalOrders: 1,
    revenue: totalAmount
  };

  if (referralCode) updates.referrals = 1;
  if (deliveryArea) updates[`deliveryAreas.${deliveryArea}`] = 1;

  await incrementDailyOrderStats(restaurantId, updates);
  await updateRestaurantPerformance(restaurantId, {
    totalOrders: 1,
    totalRevenue: totalAmount
  });
};



const handleOrderCompleted = async (data) => {
  const { restaurantId } = data;
  await ensureRestaurantPerformance(restaurantId);

  await incrementDailyOrderStats(restaurantId, { completedOrders: 1 });
  await updateRestaurantPerformance(restaurantId, { completedOrders: 1 });
};


const handleOrderCancelled = async (data) => {
  const { restaurantId, refundedAmount } = data;
  await ensureRestaurantPerformance(restaurantId);

  await incrementDailyOrderStats(restaurantId, {
    cancelledOrders: 1,
    refundedAmount: refundedAmount || 0
  });
  await updateRestaurantPerformance(restaurantId, { cancelledOrders: 1 });
};


const handleReviewCreated = async (data) => {
  const { restaurantId, rating, menuItemId } = data;

  let analytics = await ReviewAnalytics.findOne({ restaurantId });
  if (!analytics) {
    analytics = await ReviewAnalytics.create({
      restaurantId,
      totalReviews: 0,
      ratingDistribution: {},
      averageRating: 0
    });
  }

  analytics.totalReviews += 1;
  analytics.ratingDistribution[rating] = (analytics.ratingDistribution[rating] || 0) + 1;

  // Recalculate average
  let sum = 0;
  for (let i = 1; i <= 5; i++) {
    sum += i * (analytics.ratingDistribution[i] || 0);
  }
  analytics.averageRating = analytics.totalReviews ? sum / analytics.totalReviews : 0;
  await analytics.save();

  // Menu Item Ratings
  let item = await MenuItemRatings.findOne({ menuItemId });
  if (!item) {
    item = await MenuItemRatings.create({
      menuItemId,
      restaurantId,
      totalReviews: 0,
      averageRating: 0
    });
  }

  item.totalReviews += 1;
  item.averageRating = ((item.averageRating * (item.totalReviews - 1)) + rating) / item.totalReviews;
  await item.save();

  await ensureRestaurantPerformance(restaurantId);
  await updateRestaurantPerformance(restaurantId, {
    totalReviews: 1,
    averageRating: analytics.averageRating - analytics.averageRating // force recalculation
  });
};


const handleReviewUpdated = async (data) => {
  const { restaurantId, menuItemId, oldRating } = data;
  const newRating = data.rating

  if (oldRating === newRating) return;

  const analytics = await ReviewAnalytics.findOne({ restaurantId });
  if (!analytics) return;

  analytics.ratingDistribution[oldRating] = (analytics.ratingDistribution[oldRating] || 1) - 1;
  analytics.ratingDistribution[newRating] = (analytics.ratingDistribution[newRating] || 0) + 1;

  let sum = 0, total = 0;
  for (let i = 1; i <= 5; i++) {
    sum += i * (analytics.ratingDistribution[i] || 0);
    total += (analytics.ratingDistribution[i] || 0);
  }
  analytics.averageRating = total ? sum / total : 0;
  await analytics.save();

const item = await MenuItemRatings.findOne({ menuItemId });

if (item) {
  const { totalReviews = 0, averageRating = 0 } = item;


  if (totalReviews <= 1) {
   
    item.averageRating = newRating;
  } else {
    item.averageRating = (
      (averageRating * totalReviews - oldRating + newRating) / totalReviews
    );
  }

  await item.save();
}

  await ensureRestaurantPerformance(restaurantId);
  await updateRestaurantPerformance(restaurantId, {
    averageRating: analytics.averageRating - analytics.averageRating
  });
};


const handleReviewDeleted = async (data) => {
  const { restaurantId, menuItemId, rating } = data;

  // Restaurant analytics
  const analytics = await ReviewAnalytics.findOne({ restaurantId });
  if (!analytics) return;

  analytics.totalReviews = Math.max(analytics.totalReviews - 1, 0);
  analytics.ratingDistribution[rating] = (analytics.ratingDistribution[rating] || 1) - 1;

  // Recalculate average
  let sum = 0, total = 0;
  for (let i = 1; i <= 5; i++) {
    const count = Math.max(analytics.ratingDistribution[i] || 0, 0);
    sum += i * count;
    total += count;
  }
  analytics.averageRating = total > 0 ? sum / total : 0;
  await analytics.save();

  // Menu item analytics
  const item = await MenuItemRatings.findOne({ menuItemId });
  if (item) {
    item.totalReviews = Math.max(item.totalReviews - 1, 0);

    if (item.totalReviews === 0) {
      item.averageRating = 0;
    } else {
      const newTotal = item.totalReviews;
      const previousTotal = newTotal + 1; 
     

      item.averageRating = (
        (item.averageRating * previousTotal - rating) / newTotal
      );
   
    }
    

   
    if (isNaN(item.averageRating)) {
      item.averageRating = 0;
    }

    await item.save();
  }

  await ensureRestaurantPerformance(restaurantId);
  await updateRestaurantPerformance(restaurantId, {
    totalReviews: -1,
    averageRating: analytics.averageRating - analytics.averageRating
  });
};

// ========================= Consumer Setup ========================= //

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const connectWithRetry = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await consumer.connect();
      console.log('✅ Kafka consumer connected');
      return;
    } catch (err) {
      console.error(`❌ Kafka connection failed (attempt ${i + 1}):`, err.message);
      if (i < retries - 1) {
        console.log(`🔁 Retrying in ${delay / 1000}s...`);
        await wait(delay);
      } else {
        throw new Error('Kafka connection failed after maximum retries');
      }
    }
  }
};

export const startConsumer = async () => {
  await connectWithRetry();

const topics = [
  'user_created',
  'order.placed',
  'order.completed',
  'order.cancelled',
  'review.created',
  'review.updated',
  'review.deleted'
];


  for (const topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: false });
  }

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const { data } = JSON.parse(message.value.toString());
      console.log(`📥 Event on ${topic}`, data);

      try {
        switch (topic) {
          case 'user_created':
            await handleUserCreated(data);
            break;
          case 'order.placed':
            await handleOrderPlaced(data);
            break;
          case 'order.completed':
            await handleOrderCompleted(data);
            break;
          case 'order.cancelled':
            await handleOrderCancelled(data);
            break;
          case 'review.created':
            await handleReviewCreated(data);
            break;
          case 'review.updated':
            await handleReviewUpdated(data);
            break;
          case 'review.deleted':
            await handleReviewDeleted(data);
            break;
        }
      } catch (err) {
        console.error(`❌ Error processing ${topic}:`, err);
      }
    }
  });
};
