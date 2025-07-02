import UserAnalytics from '../models/UserAnalytics.js';
import OrderAnalytics from '../models/OrderAnalytics.js';
import ReviewAnalytics from '../models/ReviewAnalytics.js';
import MenuItemRatings from '../models/MenuItemRatings.js';
import RestaurantPerformance from '../models/RestaurantPerformance.js';

// USERS
export const getUserSummary = async (req, res) => {
  try {
    const analytics = await UserAnalytics.findOne({});
    res.json(analytics || {});
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user summary' });
  }
};

export const getUserGrowth = async (req, res) => {
  try {
    const analytics = await UserAnalytics.findOne({});
    res.json(analytics?.dailyRegistrations || []);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user growth' });
  }
};

// ORDERS
export const getOrderSummary = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    console.log(restaurantId)
    const date = req.query.date;

    const filter = { restaurantId: restaurantId || null };
    if (date) filter.date = date;

    const stats = await OrderAnalytics.find(filter);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching order summary' });
  }
};

export const getOrderTimeseries = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const filter = { restaurantId: restaurantId || null };

    const stats = await OrderAnalytics.find(filter).sort({ date: 1 });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching order trends' });
  }
};

export const getReferralStats = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const filter = { restaurantId: restaurantId || null };

    const total = await OrderAnalytics.aggregate([
      { $match: filter },
      { $group: { _id: null, totalReferrals: { $sum: "$referrals" } } }
    ]);

    res.json({ totalReferrals: total[0]?.totalReferrals || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching referrals' });
  }
};

export const getDeliveryAreaStats = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const filter = { restaurantId: restaurantId || null };

    const stats = await OrderAnalytics.find(filter);
    const areaCounts = {};

    stats.forEach(doc => {
      const deliveryAreas = doc.deliveryAreas instanceof Map
        ? Object.fromEntries(doc.deliveryAreas)
        : doc.deliveryAreas || {};

      for (const [area, count] of Object.entries(deliveryAreas)) {
        areaCounts[area] = (areaCounts[area] || 0) + count;
      }
    });

    res.json(areaCounts);
  } catch (err) {
    console.error('Error fetching delivery area stats:', err);
    res.status(500).json({ error: 'Error fetching delivery area stats' });
  }
};


// REVIEWS
export const getReviewSummary = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (restaurantId) {
      const analytics = await ReviewAnalytics.findOne({ restaurantId });
      return res.json(analytics || {});
    }

    const all = await ReviewAnalytics.aggregate([
      {
        $group: {
          _id: null,
          totalReviews: { $sum: "$totalReviews" },
          avgRating: { $avg: "$averageRating" }
        }
      }
    ]);

    res.json(all[0] || {});
  } catch (err) {
    res.status(500).json({ error: 'Error fetching review summary' });
  }
};

export const getRatingDistribution = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const analytics = await ReviewAnalytics.findOne({ restaurantId });
    res.json(analytics?.ratingDistribution || {});
  } catch (err) {
    res.status(500).json({ error: 'Error fetching rating distribution' });
  }
};

export const getTopRatedItems = async (req, res) => {
  try {
    const items = await MenuItemRatings.find().sort({ averageRating: -1, totalReviews: -1 }).limit(10);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching top-rated items' });
  }
};

// RESTAURANTS
export const getTopRestaurants = async (req, res) => {
  try {
    const top = await RestaurantPerformance.find().sort({ totalRevenue: -1, averageRating: -1 }).limit(5);
    res.json(top);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching top restaurants' });
  }
};

export const getLowRatedRestaurants = async (req, res) => {
  try {
    const lowRated = await RestaurantPerformance.find().sort({ averageRating: 1 }).limit(5);
    res.json(lowRated);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching low-rated restaurants' });
  }
};
