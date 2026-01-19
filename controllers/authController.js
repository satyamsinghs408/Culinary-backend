const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, mobile, username } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ 
        $or: [{ email }, { username }] 
    });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user (Plain text password for now to match current store.jsx behavior)
    // In production, use bcrypt here.
    const user = await User.create({
      name,
      email,
      username,
      mobile,
      password, 
      role
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body; // Identifier can be email, username, or mobile

    // Find user by any identifier
    const user = await User.findOne({
        $or: [
            { email: identifier },
            { username: identifier },
            { mobile: identifier }
        ]
    });

    if (user && user.password === password) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        username: user.username
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (for Admin)
// @route   GET /api/auth/users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
