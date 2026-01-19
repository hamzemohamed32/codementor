require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./src/models/User");

const seedUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ DB Connected");

        const username = "test";
        const password = "password123";

        // Check if exists
        const exists = await User.findOne({ username });
        if (exists) {
            console.log("⚠️ User 'test' already exists. Updating password...");
            exists.passwordHash = await bcrypt.hash(password, 10);
            await exists.save();
            console.log("✅ Password updated to 'password123'");
        } else {
            const passwordHash = await bcrypt.hash(password, 10);
            await User.create({ username, passwordHash });
            console.log("✅ User 'test' created with password 'password123'");
        }

        process.exit(0);
    } catch (err) {
        console.error("❌ Seed failed", err);
        process.exit(1);
    }
};

seedUser();
