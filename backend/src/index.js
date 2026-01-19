require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/projects.routes");
const chatRoutes = require("./routes/chat.routes");
const taskRoutes = require("./routes/tasks.routes");
const artifactRoutes = require("./routes/artifacts.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Backend running ✅"));

app.use("/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/artifacts", artifactRoutes);

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("✅ MongoDB connected");
        app.listen(process.env.PORT || 5000, "0.0.0.0", () =>
            console.log(`✅ Server running on http://0.0.0.0:${process.env.PORT || 5000}`)
        );
    })
    .catch((err) => {
        console.error("❌ DB error", err);
        process.exit(1);
    });
