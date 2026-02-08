
const express = require("express");
const router = express.Router();

// Import the controller functions
const {
  saveExpense,
  getExpensesByTripAndUser,
  getExpensesRequestByUser,
  saveMarkExpensesPaid,
  saveExpenseRequest,
  getTotalExpense,
  removeExpense
} = require("../Controllers/expenseController");
const authMiddleware = require("../Middleware/authMiddleware");

// Route to create a new expense entry
router.post("/create",authMiddleware, saveExpense);

// Route to get all expense requests for a specific user
router.get("/requests/:userId",authMiddleware, getExpensesRequestByUser);

// Route to get expenses for a specific trip and user
router.get("/:tripId/:userId",authMiddleware, getExpensesByTripAndUser);
router.get("/totalexpense/:tripId/:userId",authMiddleware, getTotalExpense);
router.delete("/removeexpense/:id",authMiddleware, removeExpense);
// Route to save an expense request
router.post("/request",authMiddleware, saveExpenseRequest);
router.post("/markAllPaid",authMiddleware, saveMarkExpensesPaid);

module.exports = router;
