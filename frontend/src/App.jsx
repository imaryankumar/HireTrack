import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PrivateRoute from "./Authentication/PrivateRoute";
import PublicRoute from "./Authentication/PublicRoute";
import Dashboard from "./pages/Dashboard";
import AllJobs from "./pages/AllJobs";
import Applications from "./pages/Applications";
import SavedPost from "./pages/SavedPost";
import JobTracker from "./pages/JobTracker";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/all-jobs"
        element={
          <PrivateRoute>
            <AllJobs />
          </PrivateRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <PrivateRoute>
            <Applications />
          </PrivateRoute>
        }
      />
      <Route
        path="/saved-posts"
        element={
          <PrivateRoute>
            <SavedPost />
          </PrivateRoute>
        }
      />
      <Route
        path="/job-tracker"
        element={
          <PrivateRoute>
            <JobTracker />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
