const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password)
            return res.status(400).json({ message: "username and password required" });

        if (password.length < 6)
            return res.status(400).json({ message: "Password must be at least 6 characters" });

        const exists = await User.findOne({ username });
        if (exists) return res.status(409).json({ message: "Username already exists" });

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ username, passwordHash });

        const token = jwt.sign({ userId: user._id, username }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        return res.json({
            accessToken: token,
            user: { id: user._id, username: user.username }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(`🔐 Login attempt for username: "${username}"`);

        if (!username || !password) {
            console.log("❌ Login failed: Missing credentials");
            return res.status(400).json({ message: "username and password required" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            console.log(`❌ Login failed: User "${username}" not found`);
            return res.status(401).json({ message: "Invalid credentials" });
        }

        console.log(`✅ User found: ${user.username}`);
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            console.log(`❌ Login failed: Invalid password for "${username}"`);
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id, username }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        console.log(`✅ Login successful for "${username}"`);
        return res.json({
            accessToken: token,
            user: { id: user._id, username: user.username }
        });
    } catch (err) {
        console.error("❌ Login error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
