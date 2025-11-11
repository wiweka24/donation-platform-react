import { Routes, Route, BrowserRouter } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/DashboardPage";

export default function App() {
  return (
    <main>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}
