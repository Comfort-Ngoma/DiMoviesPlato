// backend/models/User.js
import mongoose from "mongoose";

const PreferencesSchema = new mongoose.Schema(
  {
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },
    dob: {
      type: String, // You may change to Date if you want stricter typing
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    preferredLanguage: {
      type: String,
      default: "English",
    },
    mood: {
      type: String,
      default: "",
    },
    favoriteActor: {
      type: String,
      default: "",
    },
    watchFrequency: {
      type: String,
      enum: [
        "Every day",
        "Several times a week",
        "Once a week",
        "Occasionally",
        "",
      ],
      default: "",
    },
    genres: {
      type: [String],
      default: [],
    },
    notifications: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const SubscriptionSchema = new mongoose.Schema(
  {
    plan: {
      type: String,
      default: "Free Trial",
    },
    expiresAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active",
    },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    preferences: {
      type: PreferencesSchema,
      default: () => ({}),
    },
    subscription: {
      type: SubscriptionSchema,
      default: () => ({}),
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
