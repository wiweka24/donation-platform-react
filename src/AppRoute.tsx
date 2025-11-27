import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/DashboardPage";
import Layout from "./Layout";

export default function AppRoute() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        {/* Dashboard Default */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />
        {/* Page with Sidebar */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
