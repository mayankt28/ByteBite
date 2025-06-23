import jwt from 'jsonwebtoken';


export const checkAdminOrRestaurantEmployee = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ error: 'No token provided. Please login.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    // If admin, allow
    if (decoded.role === 'admin') {
      return next();
    }

  
    const userRestaurantId = decoded.restaurantId;
    const targetRestaurantId = req.params.restaurantId || req.body.restaurantId || req.query.restaurantId;

    if (
      (decoded.role === 'employee' || decoded.role === 'manager') &&
      userRestaurantId &&
      targetRestaurantId &&
      userRestaurantId === targetRestaurantId
    ) {
      return next();
    }

    return res.status(403).json({ error: 'Access denied: insufficient permissions' });
  } catch (err) {
    console.error('Error verifying token:', err);
    return res.status(500).json({ error: 'Server error. Could not verify token' });
  }
};
