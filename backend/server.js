// backend/server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import socialRoutes from "./routes/socialRoutes.js";
import listRoutes from "./routes/listRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

// Stripe webhook needs raw body
// app.use("/api/stripe", stripeWebhookRoutes);

// Main routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/recommendations", recommendationRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));
