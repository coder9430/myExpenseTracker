const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./Routes/auth");
const tripRoutes = require("./Routes/trip");
const expenseRoutes = require("./Routes/expense");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB error:", err));

app.get("/", (req, res) => {
  res.send("Server running");
});

app.use("/api/auth", authRoutes);
app.use("/trip", tripRoutes);
app.use("/expense", expenseRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
