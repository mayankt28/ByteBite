import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import redis from '../config/redis.js';

const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  // Store refresh token in Redis
  redis.set(`refreshToken:${user._id}`, refreshToken, 'EX', 7 * 24 * 60 * 60); // 7 days

  return refreshToken;
};


const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};



// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });

    await newUser.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
      
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// POST /api/auth/refresh
export const refresh = async (req, res) => {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ msg: 'No refresh token provided' });
  
    jwt.verify(token, process.env.REFRESH_SECRET, async (err, decoded) => {
      if (err || !decoded?.id) return res.status(403).json({ msg: 'Invalid token' });
  
      const storedToken = await redis.get(`refreshToken:${decoded.id}`);
      if (storedToken !== token) return res.status(403).json({ msg: 'Token does not match stored token' });
  
      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ msg: 'User not found' });
  
      const accessToken = generateAccessToken(user);
      res.json({ accessToken });
    });
  };
  
  
  // POST /api/auth/logout
  export const logout = async (req, res) => {
    try {
      const token = req.cookies?.refreshToken;
      if (token) {
        const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
        if (decoded?.id) {
          await redis.del(`refreshToken:${decoded.id}`);
        }
      }
    } catch (err) {
      console.log('Error clearing refresh token from Redis:', err.message);
    }
  
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  
    res.json({ msg: 'Logged out successfully' });
  };
  