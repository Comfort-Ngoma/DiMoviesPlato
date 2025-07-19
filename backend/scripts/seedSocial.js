// scripts/seedSocial.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import List from "../models/List.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log("✅ Connected to MongoDB");

try {
  // Clear collections
  await User.deleteMany();
  await List.deleteMany();

  // Create users
  const users = await User.insertMany([
    {
      name: "Godwin",
      email: "godwin@example.com",
      username: "oche_G",
      password: await bcrypt.hash("password123", 10),
    },
    {
      name: "Bosan",
      email: "bosan@example.com",
      username: "king_bosan",
      password: await bcrypt.hash("password123", 10),
    },
    {
      name: "Elohim",
      email: "elohim@example.com",
      username: "elohimflix",
      password: await bcrypt.hash("password123", 10),
    },
  ]);

  const [godwin, bosan, elohim] = users;

  // Simulate followers
  godwin.followers.push(bosan._id, elohim._id); // both follow godwin
  bosan.following.push(godwin._id);
  elohim.following.push(godwin._id);

  await godwin.save();
  await bosan.save();
  await elohim.save();

  // Create lists
  await List.insertMany([
    {
      userId: godwin._id,
      title: "My Action Favorites",
      description: "Top-tier action thrillers you must see.",
      movies: [
        { id: "movie1", title: "John Wick", year: 2014 },
        { id: "movie2", title: "Extraction", year: 2020 },
        { id: "movie3", title: "Gladiator", year: 2000 },
      ],
    },
    {
      userId: bosan._id,
      title: "Rom-Com Heaven",
      description: "Feel-good romantic comedies 💕",
      movies: [
        { id: "movie4", title: "Crazy Rich Asians", year: 2018 },
        { id: "movie5", title: "The Proposal", year: 2009 },
        { id: "movie6", title: "Hitch", year: 2005 },
      ],
    },
  ]);

  console.log("✅ Social data seeded successfully");
  process.exit();
} catch (err) {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
}
