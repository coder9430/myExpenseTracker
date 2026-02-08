import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Alert,
  Container,
   Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useParams } from "react-router-dom";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import HandymanIcon from "@mui/icons-material/Handyman";

function ExpensesCards() {
  const [expensesData, setExpensesData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const { tripId } = useParams();
  const currentUserId = localStorage.getItem("userId");
  const apiUrl = import.meta.env.VITE_API_URL;
  const boxRef = useRef(null);

  const deleteExpense = async (tripId, userId, expenseId) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the JWT token from storage
      const response = await fetch(
        `${apiUrl}/expense/removeexpense/${expenseId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ userId: userId, tripId: tripId }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }

      console.log("Expense deleted successfully!");
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };
  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight; // Scroll to bottom
    }
  }, [expensesData]); // Runs when expenses change
  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${apiUrl}/expense/${tripId}/${currentUserId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        setExpensesData(result.data);
      } catch (err) {
        setError("Failed to fetch expenses.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [tripId, currentUserId]);

  // Clear alerts after 4 seconds
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 4000); // Set the timeout to 4 seconds
      return () => clearTimeout(timer); // Cleanup the timer on component unmount or when message changes
    }
  }, [successMessage, error]);

  // Sort expenses by the size of table data
  const sortExpensesBySize = (expensesData) => {
    return Object.keys(expensesData)
      .map((index) => ({
        ...expensesData[index],
        userId: expensesData[index].userDetails.id,
        totalExpenses: expensesData[index].expenses.length,
      }))
      .sort((a, b) =>
        a.userId === currentUserId
          ? -1
          : b.userId === currentUserId
            ? 1
            : b.totalExpenses - a.totalExpenses,
      );
  };

  // Send Request to store data in the database
  const sendRequest = async (userId, totalMoney, expenses) => {
    try {
      const response = await fetch(`${apiUrl}/expense/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trip_id: tripId,
          user_id: userId,
          payee: currentUserId,
          total_money: totalMoney,
          expenses: expenses.map(({ category, desc, amount, _id, paid }) => ({
            category,
            desc,
            amount,
            _id,
            paid,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      setSuccessMessage("Request sent successfully!"); // Set success message
    } catch (err) {
      setError("Failed to send request.");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography
        color="error"
        sx={{
          textAlign: "center",
          mt: 3,
        }}
      >
        {error}
      </Typography>
    );
  }

  const sortedExpenses = sortExpensesBySize(expensesData);
  const copyToClipboard = (
    userId,
    userEmail,
    userName,
    expenses,
    totalAmountUnpaid,
    totalAmount,
  ) => {
    const filteredExpenses =
      userId === currentUserId
        ? expenses.filter((expense) => expense.paid) // Include only paid expenses for current user
        : expenses.filter((expense) => !expense.paid); // Include only unpaid expenses for others

    const tableData = `User: ${userName}
      Email: ${userEmail} 
      Category | Amount | Description
      ${filteredExpenses
        .map(
          (expense) =>
            `${expense.category} | ₹${expense.amount} | ${expense.desc}`,
        )
        .join("\n")}
      Total: ₹${userId === currentUserId ? totalAmount : totalAmountUnpaid}`;

    navigator.clipboard.writeText(tableData);
    setSuccessMessage("Table copied to clipboard!"); // Set success message
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 3,
        justifyContent: "center",
        alignItems: "center",
        height: "auto",
        width: "auto",
      }}
    >
      {successMessage && (
        <Alert
          severity="success"
          sx={{
            position: "fixed",
            top: 70,
            width: "50%",
            zIndex: 100,
            alignContent: "center",
            alignItems: "center",
          }}
        >
          {successMessage}
        </Alert>
      )}

      {/* Display error alert if error exists */}
      {error && (
        <Alert
          severity="error"
          sx={{
            position: "fixed",
            top: 70,
            width: "50%",
            zIndex: 100,
            alignContent: "center",
            alignItems: "center",
          }}
        >
          {error}
        </Alert>
      )}
      {sortedExpenses.length > 0 ? (
        sortedExpenses.map(({ userDetails: user, expenses, userId }) => {
          const totalAmount = expenses.reduce(
            (acc, expense) => acc + expense.amount,
            0,
          );
          const totalAmountUnpaid = expenses.reduce(
            (acc, expense) => (!expense.paid ? acc + expense.amount : 0),
            0,
          );
          const totalAmountPaid = totalAmount - totalAmountUnpaid;

          return (
            <Card
              key={userId}
              sx={{
                minWidth: 352,
                maxWidth: "100%",
                boxShadow: 6,
                borderRadius: "16px",
                transition: "transform 0.2s ease-in-out, box-shadow 0.2s",
                "&::-webkit-scrollbar": {
                  width: "4px", // Width of the vertical scrollbar
                  height: "4px", // Height of the horizontal scrollbar
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#c1c1c1", // Scrollbar thumb color
                  borderRadius: "4px", // Rounded scrollbar thumb
                  "&:hover": {
                    backgroundColor: "#a0a0a0", // Darker color on hover
                  },
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#f1f1f1", // Scrollbar track color
                  borderRadius: "4px",
                },
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 10,
                },
                background:
                  userId === currentUserId
                    ? "linear-gradient(145deg, #d4fc79, #96e6a1)"
                    : "#ffffff",
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  component="div"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    color: userId === currentUserId ? "#2d6a4f" : "#264653",
                    textAlign: "center",
                  }}
                >
                  {userId === currentUserId ? "Your Expenses" : user.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", mb: 2 }}
                >
                  {user.email}
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <TableContainer
                  component={Paper}
                  elevation={0}
                  ref={boxRef}
                  sx={{
                    width: "352px", // Set the width to fit the card
                    height: { xs: "250px", sm: "250px", md: "300px" }, // Set a fixed height for the table container
                    background: "#f9f9f9",
                    borderRadius: "8px",
                    overflowY: "auto", // Enable scrolling if content exceeds height
                    overflowX: "auto",
                    "&::-webkit-scrollbar": {
                      width: "4px", // Width of the vertical scrollbar
                      height: "4px", // Height of the horizontal scrollbar
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#c1c1c1", // Scrollbar thumb color
                      borderRadius: "4px", // Rounded scrollbar thumb
                      "&:hover": {
                        backgroundColor: "#a0a0a0", // Darker color on hover
                      },
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "#f1f1f1", // Scrollbar track color
                      borderRadius: "4px",
                    },
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#eeeeee" }}>
                        <TableCell align="left">
                          <strong>Category</strong>
                        </TableCell>
                        <TableCell align="left">
                          <strong>Amount</strong>
                        </TableCell>
                        <TableCell align="left">
                          <strong>Description</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>
                            <HandymanIcon
                              sx={{ height: "20px", width: "20px" }}
                            />
                          </strong>{" "}
                          {/* New Column for Delete */}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {expenses.map((expense) => (
                        <TableRow key={expense._id}>
                          <TableCell align="left">{expense.category}</TableCell>
                          <TableCell
                            align="left"
                            sx={{
                              color: expense.paid ? "green" : "red", // Green if true, red if false
                            }}
                          >
                            ₹{expense.amount}{" "}
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#555555",
                                fontStyle: "italic",
                                lineHeight: 1.5,
                                flexShrink: 0, // Prevent category text from shrinking
                              }}
                            >
                              {expense.paid ? "(paid)" : "(unpaid)"}
                            </Typography>
                          </TableCell>

                          <TableCell align="left">{expense.desc}</TableCell>
                          <TableCell align="left">
                            <DeleteIcon
                              onClick={() => {
                                if (!expense.paid) {
                                  setSelectedExpense({ ...expense, userId });
                                  setOpenDeleteDialog(true);
                                }
                              }}
                              sx={{
                                cursor: expense.paid ? "default" : "pointer",
                                opacity: expense.paid ? 0.2 : 1,
                                pointerEvents: expense.paid ? "none" : "auto",
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box
                  sx={{
                    marginTop: "16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#f4f4f4",
                    padding: "12px",
                    borderRadius: "8px",
                    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <Typography variant="subtitle1">
                    {userId === currentUserId ? (
                      <strong>Total Spends:</strong>
                    ) : (
                      <strong>Total Paid:</strong>
                    )}
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: "bold",
                        color: "green",
                        marginLeft: "8px",
                      }}
                    >
                      ₹{totalAmountPaid}
                    </Typography>
                  </Typography>
                  {userId !== currentUserId ? (
                    <Typography variant="subtitle1">
                      <strong>Total Unpaid:</strong>
                      <Typography
                        component="span"
                        sx={{
                          fontWeight: "bold",
                          color: "#2a9d8f",
                          marginLeft: "8px",
                        }}
                      >
                        ₹{totalAmountUnpaid}
                      </Typography>
                    </Typography>
                  ) : (
                    <Typography
                      variant="subtitle1"
                      sx={{ fontStyle: "italic", color: "#2a9d8f" }}
                    >
                      <strong>* Includes only my contributions</strong>
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  {" "}
                  {userId !== currentUserId ? (
                    <Button
                      sx={{
                        backgroundColor: "#219ebc",
                        color: "#FFF",
                        fontWeight: "bold",
                        "&:hover": {
                          backgroundColor: "#126782",
                        },
                      }}
                      variant="contained"
                      onClick={() =>
                        sendRequest(userId, totalAmountUnpaid, expenses)
                      }
                    >
                      Send Request
                    </Button>
                  ) : null}
                  <Button
                    sx={{
                      backgroundColor: "#219ebc",
                      color: "#FFF",
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "#126782",
                      },
                    }}
                    variant="contained"
                    onClick={() =>
                      copyToClipboard(
                        userId,
                        user.email,
                        user.name,
                        expenses,
                        totalAmountUnpaid,
                        totalAmount,
                      )
                    }
                  >
                    Copy Expense
                  </Button>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: "center",
                    marginTop: 2,
                    color: "#555",
                    fontStyle: "italic",
                  }}
                >
                  * After creating expense, click on 'Send Request'
                </Typography>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            textAlign: "center",
            padding: 2,
            background: "linear-gradient(135deg, #6e7aee, #ad79f5)",
            borderRadius: 2,
            boxShadow: 3,
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <Box sx={{ marginRight: 2 }}>
            <InsertChartOutlinedIcon sx={{ fontSize: 50, color: "#fff" }} />
          </Box>
          <Box>
            <Typography
              variant="h5"
              sx={{
                color: "white",
                fontWeight: 600,
                mb: 1,
              }}
            >
              Hi Traveller
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "white",
                opacity: 0.8,
              }}
            >
              No expenses have been created yet.
            </Typography>
          </Box>
        </Box>
      )}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this expense?
            <br />
            <strong>{selectedExpense?.desc || "This item"}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={async () => {
              if (!selectedExpense) return;

              await deleteExpense(
                tripId,
                selectedExpense.userId,
                selectedExpense._id,
              );

              setOpenDeleteDialog(false);
              setSelectedExpense(null);

              window.location.reload();
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ExpensesCards;
