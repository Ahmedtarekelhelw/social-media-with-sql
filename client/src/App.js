import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";

// layout
import RootLayout from "./layout/RootLayout";

// pages
import Home from "./pages/home/Home";
import Login, { loginForm } from "./pages/login/Login";
import Register, { registerForm } from "./pages/register/Register";
import Profile from "./pages/profile/Profile";
import { Auth } from "./context/authContext";

const ProtectedRoute = ({ children }) => {
  const { user } = Auth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

const ProtectAuthRoute = ({ children }) => {
  const { user } = Auth();
  if (user) {
    return <Navigate to="/" />;
  }
  return children;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        element={
          <ProtectedRoute>
            <RootLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="profile/:id" element={<Profile />} />
      </Route>
      <Route
        path="login"
        element={
          <ProtectAuthRoute>
            <Login />
          </ProtectAuthRoute>
        }
        action={loginForm}
      />
      <Route
        path="register"
        element={
          <ProtectAuthRoute>
            <Register />
          </ProtectAuthRoute>
        }
        action={registerForm}
      />
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
