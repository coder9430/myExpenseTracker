import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  CircularProgress,
  Divider,
} from "@mui/material";

function ExpensePopup({ tripId, userId, open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchExpenses = async () => {
    if (!open) return; // Only fetch if the dialog is open
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token"); // Retrieve the JWT token from storage 
      const response = await fetch(
        `${apiUrl}/expense/totalexpense/${tripId}/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }
      const data = await response.json();
      setExpenses(data.data.expenses || []);
    } catch (err) {
      setError(err.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [open]);

  // Calculate totals
  const totalPerCategory = expenses?.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const totalSpent = expenses?.reduce((acc, expense) => acc + expense.amount, 0);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Expense Details</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ textAlign: "center", my: 4 }}>
            <CircularProgress />
            <Typography>Loading expenses...</Typography>
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ textAlign: "center" }}>
            {error}
          </Typography>
        ) : expenses.length === 0 ? (
          <Typography sx={{ textAlign: "center", my: 4 }}>
            No expenses found for this trip.
          </Typography>
        ) : (
          <>
            {/* Total Spent */}
            <Box sx={{ mb: 3, textAlign: "center" }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 , backgroundImage:
              "linear-gradient(160deg, #0a6a9b 0%, #44b5ad 100%)",color:'white',borderRadius:'20px'}}>
                Total Spent: ₹{totalSpent || 0}
              </Typography>
              <Divider />
            </Box>

            {/* Category Summary */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                Spent Per Category
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#eeeeee" }}>
                      <TableCell>
                        <strong>Category</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Amount</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(totalPerCategory || {}).map(
                      ([category, total]) => (
                        <TableRow key={category}>
                          <TableCell>{category}</TableCell>
                          <TableCell align="right">₹{total}</TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Detailed Expense List */}
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              All Expenses
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#eeeeee" }}>
                    <TableCell>
                      <strong>Category</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Amount</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Description</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense._id}>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell align="right">₹{expense.amount}</TableCell>
                      <TableCell>{expense.desc}</TableCell>
                      <TableCell>
                        {expense.paid ? (
                          <Typography
                            component="span"
                            sx={{ color: "green", fontWeight: "bold" }}
                          >
                            Paid
                          </Typography>
                        ) : (
                          <Typography
                            component="span"
                            sx={{ color: "red", fontWeight: "bold" }}
                          >
                            Unpaid
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ExpensePopup;
