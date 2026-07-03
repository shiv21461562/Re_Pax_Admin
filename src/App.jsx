import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Speakers from "./pages/Speakers";
import Sponsors from "./pages/Sponsors";
import Agenda from "./pages/Agenda";
import Contacts from "./pages/Contacts";
import BoothBookings from "./pages/BoothBookings";

import Sidebar from "./components/sidebar";
import Navbar from "./components/Navbar";
import Blogs from "./pages/Blogs";
import BrochureDownloads from "./pages/BrochureDownloads";
import Registrations from "./pages/Registrations";

function ProtectedRoute({ children }) {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function Layout() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/speakers" element={<Speakers />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/booth-bookings" element={<BoothBookings />} />
            <Route path="/Blogs" element={<Blogs />} />

            <Route path="/brochure-downloads" element={<BrochureDownloads />} />
             <Route path="/registrations" element={<Registrations />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("isLoggedIn") === "true",
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/" />
            ) : (
              <Login onLogin={() => setIsLoggedIn(true)} />
            )
          }
        />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
