// const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/finalproject")

// 	.then(() => {
// 		console.log("Connected to DB Successfully!!!")
// 	}).catch((err) => {
// 		console.log(err)
// 	})

require('dotenv').config();
const mongoose = require("mongoose");

console.log(process.env.MONGO_URI)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas Successfully!");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

module.exports = mongoose;  // 👈 Export mongoose connection
