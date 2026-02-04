require("dotenv").config();

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    if (!process.env.URL_DATABASE) {
      throw new Error("URL_DATABASE is not defined in .env file");
    }
    
    const conn = await mongoose.connect(process.env.URL_DATABASE);
    console.log("Connected to MongoDB!");
    console.log(`Database: ${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    throw err; 
  }
};

module.exports = connectDB;
