const express = require("express");
const router = express.Router();
const {
  createTrip,
  getUserTrips,
  joinTrip,
  getAllUsernames,
  getAllCategory,
  addNewCategory,
} = require("../Controllers/tripController");
const authMiddleware = require("../Middleware/authMiddleware");

// Route to create a new trip
router.post("/create",authMiddleware, createTrip);

// Route to fetch trips for a specific user
router.get("/user/:userId",authMiddleware, getUserTrips);
router.get("/allusernames/:tripId",authMiddleware, getAllUsernames);
router.get("/allcategory/:tripId",authMiddleware, getAllCategory);
router.post("/addnewcategory",authMiddleware, addNewCategory);
router.post("/join",authMiddleware, joinTrip);

module.exports = router;
