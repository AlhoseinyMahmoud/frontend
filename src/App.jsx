import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "./pages/homePage";
import SignIn from "./pages/SignIn";
import Employees from "./pages/employees";
import Client from "./pages/client";
import Products from "./pages/products";
import Report from "./pages/report";
import Repo from "./pages/Repo";

function ProtectedRoute({ element }) {
  const token = localStorage.getItem("user");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      // If no token, redirect to SignIn page
      navigate("/signin");
    }
  }, [token, navigate]);

  if (!token) {
    return null; // Do not render the protected page if no token
  }

  return element; // Render the page if the token exists
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/signin"
          loader={async ({ request }) => {
            const res = await fetch("/api/user.json", {
              signal: request.signal,
            });
            const user = await res.json();
            return user;
          }}
          element={<SignIn />}
        />
        <Route path="/" element={<ProtectedRoute element={<HomePage />} />} />
        <Route path="/employees" element={<ProtectedRoute element={<Employees />} />} />
        <Route path="/client" element={<ProtectedRoute element={<Client />} />} />
        <Route path="/products" element={<ProtectedRoute element={<Products />} />} />
        <Route path="/report" element={<ProtectedRoute element={<Report />} />} />
        <Route path="/repo" element={<ProtectedRoute element={<Repo />} />} />
        <Route path="*" element={"404"} /> {/* Custom 404 page */}
      </Routes>
    </BrowserRouter>
  );
}
