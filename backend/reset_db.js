require("dotenv").config();
const mongoose = require("mongoose");

const resetDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ DB Connected");

        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            if (collection.collectionName === 'users') {
                console.log("⚠️ Dropping 'users' collection to remove old index constraints...");
                await collection.drop();
                console.log("✅ 'users' collection dropped.");
            }
        }

        console.log("🌱 Re-seeding test user...");
        const User = require("./src/models/User");
        const bcrypt = require("bcrypt");

        const username = "test";
        const password = "password123";
        const passwordHash = await bcrypt.hash(password, 10);

        await User.create({ username, passwordHash });
        console.log("✅ User 'test' created (password: password123)");

        process.exit(0);
    } catch (err) {
        console.error("❌ Reset failed", err);
        process.exit(1);
    }
};

resetDb();
