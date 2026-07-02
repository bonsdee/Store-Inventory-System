import { useState } from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import POS from "./pages/POS";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Stock from "./pages/Stock";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";

import "./App.css";

function App() {
  const [page, setPage] = useState("Dashboard");

  return (
    <div className="app">
      <Header />

      <div className="main-container">
        <Sidebar page={page} setPage={setPage} />

        <main className="content">
          {page === "Dashboard" && <Dashboard />}
          {page === "POS" && <POS />}

          {page === "Products" && <Products />}

          {page === "Stock" && <Stock />}

          {page === "Transactions" && <Transactions />}

          {page === "Reports" && <Reports />}
        </main>
      </div>
    </div>
  );
}

export default App;
