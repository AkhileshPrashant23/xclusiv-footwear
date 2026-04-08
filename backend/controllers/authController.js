const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(400).json({ success: false, message: 'Email already registered' });

    const existingPhone = await User.findOne({ phone });
    if (existingPhone)
      return res.status(400).json({ success: false, message: 'Phone number already registered' });

    const user = await User.create({ fullName, email, phone, password });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/login  (phone + password)
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password)
      return res.status(400).json({ success: false, message: 'Phone and password are required' });

    const user = await User.findOne({ phone });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid phone or password' });

    res.json({
      success: true,
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/admin-login
exports.adminLogin = async (req, res) => {
  try {
    const { adminId, password } = req.body;

    const ADMIN_ID = process.env.ADMIN_ID || 'Manzur1508';
    const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'Manzur1508@';

    if (adminId !== ADMIN_ID || password !== ADMIN_PASS)
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });

    // Find or create admin user in DB
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = await User.create({
        fullName: 'Admin',
        email: 'admin@xclusivfootwear.com',
        phone: '0000000000',
        password: ADMIN_PASS,
        role: 'admin',
      });
    }

    res.json({
      success: true,
      data: {
        _id: admin._id,
        fullName: 'Admin',
        role: 'admin',
        token: generateToken(admin._id),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, data: req.user });
};
