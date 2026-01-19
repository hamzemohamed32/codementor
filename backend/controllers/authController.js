const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register User
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login User
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // If user was created via Google, they might not have a password
        if (!user.password) {
            return res.status(400).json({ message: 'Please login with Google' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            photo: user.photo,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const verifyGoogleToken = async (req, res) => {
    const { idToken } = req.body;

    try {
        // Since Firebase is removed, we use mock verification.
        // In production, use google-auth-library.
        console.log('Mocking Google Token Verification for ID:', idToken);

        const mockUid = 'google_user_123';
        const email = 'user@example.com';
        const name = 'Demo User';
        const picture = 'https://example.com/photo.jpg';

        let user = await User.findOne({ googleId: mockUid });

        if (!user) {
            user = await User.create({
                googleId: mockUid,
                email,
                name,
                photo: picture
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            photo: user.photo,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid Google Token (Mock)' });
    }
};

module.exports = { verifyGoogleToken, register, login };
