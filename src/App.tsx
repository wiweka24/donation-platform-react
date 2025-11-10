import { Routes, Route, BrowserRouter } from "react-router-dom";

import { Dashboard } from "./pages/Dashboard";

export default function App() {
  return (
    <main>
      <BrowserRouter basename="/donation-platform">
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}
