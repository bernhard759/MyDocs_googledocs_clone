import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import Docs from "./components/Docs";
import { Logout, Delete } from "@mui/icons-material";
import EditDocs from "./components/EditDoc";
import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import Login from "./components/Login";
import PrivateRoute from "./components/auth/PrivateRoute";
import PublicOnlyRoute from "./components/auth/PublicOnlyRoute";
import { database, auth } from "./firebaseConfig";

function App() {
  // Navigation
  const navigate = useNavigate();

  // User
  const [user, loading] = useAuthState(auth);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      alert("Error logging out: " + error.message);
    }
  };

  // Handle Account Deletion
  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        // Reauthenticate the user
        const credential = EmailAuthProvider.credential(
          user.email,
          prompt("Please enter your password to confirm:")
        );
        await reauthenticateWithCredential(user, credential);

        // After successful reauthentication, delete the account
        await user.delete();
        alert("Account deleted successfully.");
        navigate("/login");
      } catch (error) {
        if (error.code === "auth/requires-recent-login") {
          console.error("Please log in again and try deleting your account.");
        } else {
          console.error("Error deleting account: " + error.message);
        }
      }
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ color: "inherit", textDecoration: "none" }}
          >
            Google Docs Clone
          </Typography>
          {!loading && user && (
            <Container sx={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton color="inherit" onClick={handleLogout} title="Logout">
                <Logout />
              </IconButton>
              <IconButton
                color="inherit"
                onClick={handleDeleteAccount}
                title="Delete Account"
              >
                <Delete />
              </IconButton>
            </Container>
          )}
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Docs database={database} auth={auth} />
              </PrivateRoute>
            }
          />
          <Route
            path="/editDocs/:slugId"
            element={
              <PrivateRoute>
                <EditDocs database={database} auth={auth} />
              </PrivateRoute>
            }
          />
        </Routes>
      </Container>
    </>
  );
}

export default App;
